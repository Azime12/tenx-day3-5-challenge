import { Agent } from '../common/antigravity';
import { Task, Goal, TaskStatus, TaskType } from '../common/types';

export class PlannerAgent extends Agent {
  constructor() {
    super('planner', {
      model: 'gemini-2.0-flash-thinking',
      temperature: 0.3,
      systemPrompt: `You are a strategic planner for Project Chimera.
      Decompose high-level goals into executable tasks.
      Consider: platform constraints, persona alignment, budget limits.
      Output: Task DAG in JSON format.`
    });
  }

  /**
   * Decomposes a Goal into a Directed Acyclic Graph (DAG) of Tasks.
   * Ensures tasks are atomically structured and platform-compliant.
   */
  async decomposeGoal(goal: Goal): Promise<Task[]> {
    const prompt = `Decompose the following goal into a set of atomic, executable tasks:
    GOAL ID: ${goal.goalId}
    DESCRIPTION: ${goal.description}
    PERSONA: ${goal.personaId}
    BUDGET ALLOCATED: $${goal.budget}
    PRIORITY: ${goal.priority}
    
    CRITICAL CONSTRAINTS:
    1. Tasks must be research-focused (RESEARCH), content-creation (CONTENT), or social publishing (DISTRIBUTION).
    2. Define clear dependencies between tasks (e.g., CONTENT depends on RESEARCH).
    3. Ensure budget is not exceeded.
    
    Output a strictly valid JSON array of tasks following this schema:
    [{
      "taskId": "string",
      "type": "RESEARCH" | "CONTENT" | "DISTRIBUTION",
      "priority": number,
      "dependencies": ["taskId"],
      "data": { ...task_specific_data... }
    }]`;
    
    const response = await this.complete(prompt);
    try {
      // Extract JSON if model wraps it in markdown blocks
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      const tasks: Task[] = JSON.parse(jsonStr);

      // Validate base status for each task
      return tasks.map(t => ({
        ...t,
        status: TaskStatus.PENDING
      }));
    } catch (err) {
      console.error('[MCP-LOG] Failed to decompose goal into valid DAG:', err);
      // Fallback: Create a single failed task node
      return [{
        taskId: `fail-${Date.now()}`,
        type: TaskType.RESEARCH,
        status: TaskStatus.FAILED,
        priority: 0,
        dependencies: [],
        data: { error: 'Decomposition failed' }
      }];
    }
  }
}
