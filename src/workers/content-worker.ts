import redis from '../common/redis';
import { TaskStatus, TaskType } from '../common/types';
import { logAudit } from '../telemetry/mcp_logger';

export class ContentWorker {
  /**
   * Processes CONTENT tasks by generating LLM responses.
   */
  public async work() {
    console.log('[MCP-LOG] ContentWorker started polling...');

    while (true) {
      const taskId = await redis.brpoplpush('task_queue', 'processing_queue', 0);
      if (!taskId) continue;

      const taskData = await redis.hgetall(`task:${taskId}`);
      if (taskData.type !== TaskType.CONTENT) {
        await redis.lpush('task_queue', taskId);
        continue;
      }

      logAudit('ContentWorker', `Processing task ${taskId}`, { input: taskData.input });

      try {
        // Mock OpenAI Generation
        const result = {
          content: "The future of AI agents is non-custodial. Sovereignty is the endgame. #Chimera [AI Generated]",
          platforms: ['Twitter'],
          ai_disclosed: true
        };

        const version = parseInt(taskData.version || '0');
        await (redis as any).updateTaskOCC(
          `task:${taskId}`,
          version,
          TaskStatus.REVIEW, // Send to HITL by default for safety
          JSON.stringify(result)
        );

        // Add to HITL Queue explicitly if version matches
        await redis.sadd('hitl_queue', taskId);

        logAudit('ContentWorker', `Task ${taskId} sent to HITL review.`);
      } catch (err) {
        console.error(`[MCP-LOG] ContentWorker error on task ${taskId}:`, err);
      }
    }
  }
}

if (require.main === module) {
  new ContentWorker().work();
}
