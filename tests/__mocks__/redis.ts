import { vi } from 'vitest';

// Mock Redis client
const mockRedis = {
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
};

export default mockRedis;
