import redis from '../../src/common/redis';
import { cfoJudge } from '../../src/orchestrator/cfo_judge';

describe('CFO Judge Budget Enforcement', () => {
  const agentId = 'test-agent';

  beforeEach(async () => {
    await redis.flushall();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('should allow spend within daily limit ($50)', async () => {
    const authorized = await cfoJudge.authorizeSpend(agentId, 30.00);
    expect(authorized).toBe(true);
    
    const authorized2 = await cfoJudge.authorizeSpend(agentId, 15.00);
    expect(authorized2).toBe(true);
  });

  it('should reject spend exceeding daily limit', async () => {
    await cfoJudge.authorizeSpend(agentId, 40.00);
    const authorized = await cfoJudge.authorizeSpend(agentId, 15.00);
    expect(authorized).toBe(false);
  });

  it('should reject spend exceeding weekly limit ($200)', async () => {
    // Inject mock weekly spent
    const today = new Date();
    const numberOfDays = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);
    const weekKey = `budget:${agentId}:week:${weekNum}`;
    
    await redis.set(weekKey, '190.00');

    const authorized = await cfoJudge.authorizeSpend(agentId, 15.00);
    expect(authorized).toBe(false);
  });

  it('should handle decimal precision correctly', async () => {
    await cfoJudge.authorizeSpend(agentId, 49.95);
    const authorized = await cfoJudge.authorizeSpend(agentId, 0.10);
    expect(authorized).toBe(false);
  });
});
