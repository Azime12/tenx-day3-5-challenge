import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Lua script for Optimistic Concurrency Control task updates
// ARGV[1]: Expected Version, ARGV[2]: New Status, ARGV[3]: New Output (JSON string)
const updateTaskWithOCC = `
  local currentVersion = redis.call('HGET', KEYS[1], 'version')
  if tonumber(currentVersion) == tonumber(ARGV[1]) then
    redis.call('HSET', KEYS[1], 'status', ARGV[2], 'output', ARGV[3], 'version', tonumber(currentVersion) + 1)
    return 1
  else
    return 0
  end
`;

redis.defineCommand('updateTaskOCC', {
  numberOfKeys: 1,
  lua: updateTaskWithOCC,
});

export default redis;

export async function getTask(taskId: string) {
  return await redis.hgetall(`task:${taskId}`);
}
