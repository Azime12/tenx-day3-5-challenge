import { AgentTask, TaskStatus, TaskType } from '../common/types';
import redis from '../common/redis';
import { logAudit } from '../telemetry/mcp_logger';

export interface AdjudicationResult {
  confidenceScore: number;
  decision: 'APPROVE' | 'REJECT' | 'ASYNC_REVIEW';
  comment?: string;
}

export class Judge {
  private static AUTO_APPROVE_THRESHOLD = 0.90;
  private static ASYNC_REVIEW_THRESHOLD = 0.70;

  /**
   * Adjudicates a task based on its confidence score.
   * Derives the decision according to Three-Tier HITL Safety rules.
   */
  public async adjudicate(task: AgentTask, confidenceScore: number): Promise<AdjudicationResult> {
    let decision: 'APPROVE' | 'REJECT' | 'ASYNC_REVIEW';

    if (confidenceScore >= Judge.AUTO_APPROVE_THRESHOLD) {
      decision = 'APPROVE';
    } else if (confidenceScore >= Judge.ASYNC_REVIEW_THRESHOLD) {
      decision = 'ASYNC_REVIEW';
    } else {
      decision = 'REJECT';
    }

    logAudit('Judge', `Task ${task.taskId} adjudicated.`, {
      taskId: task.taskId,
      confidenceScore,
      decision,
    });

    return { confidenceScore, decision };
  }

  /**
   * Finalizes the task state in the orchestrator based on adjudication.
   */
  public async finalizeTask(taskId: string, result: AdjudicationResult) {
    const taskData = await redis.hgetall(`task:${taskId}`);
    if (!taskData) throw new Error(`Task ${taskId} not found`);

    const version = parseInt(taskData.version || '0');
    let nextStatus: TaskStatus;

    switch (result.decision) {
      case 'APPROVE':
        nextStatus = TaskStatus.DONE;
        await redis.srem('hitl_queue', taskId); // Remove from queue if it was there
        break;
      case 'ASYNC_REVIEW':
        nextStatus = TaskStatus.REVIEW;
        await redis.sadd('hitl_queue', taskId); // Add to HITL queue
        break;
      case 'REJECT':
        nextStatus = TaskStatus.ERROR;
        await redis.srem('hitl_queue', taskId);
        break;
      default:
        nextStatus = TaskStatus.ERROR;
    }

    // ARGV[1]: Expected Version, ARGV[2]: New Status, ARGV[3]: New Output (JSON string)
    // Use the updateTaskOCC defined in redis.ts
    const success = await (redis as any).updateTaskOCC(
      `task:${taskId}`, 
      version, 
      nextStatus, 
      JSON.stringify({ adjudication: result })
    );

    if (!success) {
      logAudit('Judge', `OCC Conflict finalizing task ${taskId}. Retry may be required.`);
      throw new Error('Optimistic Concurrency Control conflict');
    }

    return success;
  }
}

export const judge = new Judge();
