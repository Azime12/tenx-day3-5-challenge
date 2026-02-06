import { Agent } from '../common/antigravity';

export class CFOAgent extends Agent {
  constructor() {
    super('cfo', {
      model: 'gemini-1.5-flash',
      temperature: 0.0,
      systemPrompt: `You are the Chief Financial Officer for Project Chimera.
      Maintain budget integrity ($50 daily / $200 weekly).
      Authorize economic transactions via Coinbase AgentKit.
      Reject any spend that exceeds allocated limits or lacks valid justification.`
    });
  }

  /**
   * Authorizes a proposed spend after checking limits.
   */
  async authorizeSpend(amount: number, reason: string): Promise<{ authorized: boolean; txHash?: string }> {
    const prompt = `Authorize this spend:
    AMOUNT: $${amount}
    REASON: ${reason}
    
    Current limits: $50 daily / $200 weekly.
    Return JSON: { "authorized": boolean, "txHash": string | null, "reason": string }`;
    
    const response = await this.complete(prompt);
    try {
      return JSON.parse(response);
    } catch (err) {
      console.error('[MCP-LOG] Failed to parse CFOAgent authorization:', err);
      return { authorized: false };
    }
  }
}
