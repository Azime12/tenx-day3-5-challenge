import { SwarmGoal, GoalStatus, AgentTask, TaskType, TaskStatus } from '../common/types';
import redis from '../common/redis';
import { v4 as uuidv4 } from 'uuid';
import { logAudit } from '../telemetry/mcp_logger';

export class Planner {
  /**
   * Decomposes a SwarmGoal into a set of initial AgentTasks.
   * For US1: Decomposes into RESEARCH (Trend) -> SYNTHESIS -> CONTENT.
   */
  public async decompose(goal: SwarmGoal): Promise<AgentTask[]> {
    logAudit('Planner', `Decomposing goal: ${goal.description}`);

    const tasks: AgentTask[] = [
      {
        taskId: uuidv4(),
        goalId: goal.goalId,
        type: TaskType.RESEARCH,
        status: TaskStatus.QUEUED,
        input: { trendQuery: goal.description },
        version: 1,
      },
      {
        taskId: uuidv4(),
        goalId: goal.goalId,
        type: TaskType.CONTENT,
        status: TaskStatus.QUEUED,
        input: { prompt: `Generate content for: ${goal.description}` },
        version: 1,
      }
    ];

    // Persist tasks in Redis
    for (const task of tasks) {
      await redis.hset(`task:${task.taskId}`, {
        ...task,
        input: JSON.stringify(task.input),
        createdAt: new Date().toISOString()
      });
      await redis.lpush('task_queue', task.taskId);
    }

    return tasks;
  }
}

export const planner = new Planner();
