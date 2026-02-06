import { vi } from 'vitest';

// Mock CFO Judge
export const cfoJudge = {
  authorizeSpend: vi.fn().mockImplementation(async (agentId: string, amount: number) => {
    // Simple mock: allow spend under $50
    return amount <= 50;
  }),
};
