import { Agent } from '../common/antigravity';
import { Task, TaskStatus, TaskType } from '../common/types';
import { logAudit } from '../telemetry/mcp_logger';

export class WorkerAgent extends Agent {
  constructor() {
    super('worker', {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      systemPrompt: `You are a specialized worker in the Chimera swarm.
      Execute tasks using the available MCP tools.
      Focus on platform engagement, trend research, and content creation.
      Always adhere to the influencer's persona and safety constraints.`
    });
  }

  /**
   * Executes a specific Task by delegating to the appropriate Skill or MCP tool.
   * Dynamically routes based on TaskType.
   */
  async executeTask(task: Task): Promise<any> {
    logAudit('WorkerAgent', `Executing task: ${task.taskId}`, { type: task.type });

    try {
      let result;
      switch (task.type) {
        case TaskType.RESEARCH:
          // In a real scenario, this would call specialized research tools
          result = await this.useResearchSkill(task.data);
          break;
        case TaskType.CONTENT:
          result = await this.useContentSkill(task.data);
          break;
        case TaskType.DISTRIBUTION:
          result = await this.useSocialSkill(task.data);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }

      return {
        status: TaskStatus.DONE,
        output: result,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      logAudit('WorkerAgent', `Task failed: ${task.taskId}`, { error: (err as Error).message });
      return {
        status: TaskStatus.FAILED,
        error: (err as Error).message,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async useResearchSkill(data: any): Promise<any> {
    const prompt = `Perform trend research based on: ${JSON.stringify(data)}. 
    Use available social signals to identify high-volume topics.`;
    return await this.complete(prompt);
  }

  private async useContentSkill(data: any): Promise<any> {
    const prompt = `Generate persona-aligned content for: ${JSON.stringify(data)}. 
    Ensure [AI Generated] disclosure is included.`;
    return await this.complete(prompt);
  }

  private async useSocialSkill(data: any): Promise<any> {
    const prompt = `Prepare and simulate social publishing for: ${JSON.stringify(data)}. 
    Identify optimal platform and timing.`;
    return await this.complete(prompt);
  }
}
