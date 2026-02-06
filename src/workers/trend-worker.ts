import redis from '../common/redis';
import { TaskStatus, TaskType } from '../common/types';
import { logAudit } from '../telemetry/mcp_logger';

export class TrendWorker {
  /**
   * Processes RESEARCH/Trend tasks by querying Twitter (mocked for now).
   */
  public async work() {
    console.log('[MCP-LOG] TrendWorker started polling...');
    
    while (true) {
      const taskId = await redis.brpoplpush('task_queue', 'processing_queue', 0);
      if (!taskId) continue;

      const taskData = await redis.hgetall(`task:${taskId}`);
      if (taskData.type !== TaskType.RESEARCH) {
        await redis.lpush('task_queue', taskId); // Put back
        continue;
      }

      logAudit('TrendWorker', `Processing task ${taskId}`, { input: taskData.input });

      try {
        // Mock Twitter Search Results
        const result = {
          trends: ['Crypto Regulation', 'AI Agents', 'OpenSource UI'],
          sentiment: 'Bullish'
        };

        const version = parseInt(taskData.version || '0');
        await (redis as any).updateTaskOCC(
          `task:${taskId}`,
          version,
          TaskStatus.DONE,
          JSON.stringify(result)
        );

        logAudit('TrendWorker', `Task ${taskId} completed.`);
      } catch (err) {
        console.error(`[MCP-LOG] TrendWorker error on task ${taskId}:`, err);
      }
    }
  }
}

if (require.main === module) {
  new TrendWorker().work();
}
