// Vitest setup file
import { vi } from 'vitest';

// Mock Redis globally
vi.mock('../src/common/redis', () => ({
  default: {
    flushall: vi.fn().mockResolvedValue('OK'),
    flushdb: vi.fn().mockResolvedValue('OK'),
    quit: vi.fn().mockResolvedValue('OK'),
    hgetall: vi.fn().mockResolvedValue({}),
    hset: vi.fn().mockResolvedValue(1),
    set: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    lpush: vi.fn().mockResolvedValue(1),
    rpop: vi.fn().mockResolvedValue(null),
    sadd: vi.fn().mockResolvedValue(1),
    srem: vi.fn().mockResolvedValue(1),
    smembers: vi.fn().mockResolvedValue([]),
    updateTaskOCC: vi.fn().mockResolvedValue(1),
  },
}));

// Mock CFO Judge globally
vi.mock('../src/orchestrator/cfo_judge', () => ({
  cfoJudge: {
    authorizeSpend: vi.fn().mockImplementation(async (agentId: string, amount: number) => {
      return amount <= 50;
    }),
  },
}));

// Basic test to verify setup
import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
  it('should have globals configured', () => {
    expect(true).toBe(true);
  });
});
