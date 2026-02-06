import redis from '../common/redis';
import { logAudit } from '../telemetry/mcp_logger';

export class CFOJudge {
  private static DAILY_LIMIT = 50.00; // USD approx
  private static WEEKLY_LIMIT = 200.00;

  /**
   * Checks if an economic action fits within the budget.
   * Uses Redis INCR for simple atomic spending tracking.
   */
  public async authorizeSpend(agentId: string, amount: number): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const dayKey = `budget:${agentId}:day:${today}`;
    const weekKey = `budget:${agentId}:week:${getWeekNumber(new Date())}`;

    try {
      const dailySpent = await redis.get(dayKey);
      const weeklySpent = await redis.get(weekKey);

      const currentDaily = parseFloat(dailySpent || '0');
      const currentWeekly = parseFloat(weeklySpent || '0');

      if (currentDaily + amount > CFOJudge.DAILY_LIMIT) {
        logAudit('CFOJudge', `Spend REJECTED for ${agentId}. Daily limit exceeded.`, { dailySpent, amount });
        return false;
      }

      if (currentWeekly + amount > CFOJudge.WEEKLY_LIMIT) {
        logAudit('CFOJudge', `Spend REJECTED for ${agentId}. Weekly limit exceeded.`, { weeklySpent, amount });
        return false;
      }

      // Atomic update
      await redis.incrbyfloat(dayKey, amount);
      await redis.incrbyfloat(weekKey, amount);

      logAudit('CFOJudge', `Spend AUTHORIZED for ${agentId}.`, { amount });
      return true;
    } catch (err) {
      console.error('[MCP-LOG] CFOJudge error:', err);
      return false;
    }
  }
}

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
}

export const cfoJudge = new CFOJudge();
