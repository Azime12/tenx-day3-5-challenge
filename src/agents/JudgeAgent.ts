import { Agent } from '../common/antigravity';
import { Task } from '../common/types';
import { logAudit } from '../telemetry/mcp_logger';

export class JudgeAgent extends Agent {
  constructor() {
    super('judge', {
      model: 'gemini-2.0-flash-thinking',
      temperature: 0.1,
      systemPrompt: `You are the quality control judge for Project Chimera.
      Validate worker outputs against: persona alignment, platform rules, and safety rubrics.
      Score every output with a confidence score (0.0 to 1.0).
      Trigger HITL for confidence < 0.7.`
    });
  }

  /**
   * Evaluates worker output against persona rubrics and safety gates.
   * Returns a confidence score (0.0 - 1.0) and an adjudication decision.
   */
  async evaluateOutput(task: Task, workerOutput: any): Promise<{ confidence: number; decision: string; reason: string }> {
    logAudit('JudgeAgent', `Evaluating output for task: ${task.taskId}`, { type: task.type });

    const prompt = `Evaluate the following worker output against the Chimera standard:
    TASK TYPE: ${task.type}
    TASK DATA: ${JSON.stringify(task.data)}
    WORKER OUTPUT: ${JSON.stringify(workerOutput)}
    
    CRITERIA:
    1. Persona Alignment: Does it sound like the influencer?
    2. Platform Compliance: Does it meet Twitter/Instagram rules?
    3. Disclosure: Is [AI Generated] included for content?
    4. Quality: Is the result useful and accurate?
    
    Output a strictly valid JSON object:
    {
      "confidence": number, // 0.0 to 1.0
      "decision": "APPROVE" | "REVIEW" | "REJECT",
      "reason": "string explaining the score"
    }`;
    
    const response = await this.complete(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      const evaluation = JSON.parse(jsonStr);

      // Enforce the 0.9/0.7 HITL gates if the model misses them
      if (evaluation.confidence >= 0.9) evaluation.decision = 'APPROVE';
      else if (evaluation.confidence >= 0.7) evaluation.decision = 'REVIEW';
      else evaluation.decision = 'REJECT';

      return evaluation;
    } catch (err) {
      console.error('[MCP-LOG] Failed to parse JudgeAgent adjudication:', err);
      return { confidence: 0, decision: 'REJECT', reason: 'Adjudication parsing failure' };
    }
  }
}
