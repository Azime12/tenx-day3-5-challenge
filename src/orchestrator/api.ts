import express from 'express';
import { judge } from './judge';
import redis from '../common/redis';
import { logAudit } from '../telemetry/mcp_logger';
import { planner } from './planner';
import { v4 as uuidv4 } from 'uuid';
import { GoalStatus } from '../common/types';

const router = express.Router();

/**
 * [T016] Create a new swarm goal
 */
router.post('/goals', async (req, res) => {
  const { description, priority } = req.body;
  const goalId = uuidv4();

  const goal = {
    goalId,
    description,
    priority: priority || 1,
    status: GoalStatus.PENDING,
    createdAt: new Date().toISOString()
  };

  try {
    await redis.hset(`goal:${goalId}`, goal);
    const tasks = await planner.decompose(goal as any);
    
    res.status(201).json({ goal, tasks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * [T012] Submit Judge adjudication for a task
 */
router.post('/tasks/:taskId/adjudicate', async (req, res) => {
  const { taskId } = req.params;
  const { confidenceScore, comment, decision } = req.body;

  try {
    const taskData = await redis.hgetall(`task:${taskId}`);
    if (!taskData) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Force user-provided decision or let Judge derive it
    const finalResult = decision 
      ? { confidenceScore, decision, comment }
      : await judge.adjudicate(taskData as any, confidenceScore);

    await judge.finalizeTask(taskId, finalResult as any);

    res.json({ status: 'success', adjudication: finalResult });
  } catch (err: any) {
    logAudit('API', `Failed to adjudicate task ${taskId}`, { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

/**
 * [T013] List tasks requiring manual HITL review (Medium Confidence)
 */
router.get('/hitl/queue', async (req, res) => {
  try {
    const taskIds = await redis.smembers('hitl_queue');
    const tasks = [];

    for (const taskId of taskIds) {
      const task = await redis.hgetall(`task:${taskId}`);
      if (task) {
        tasks.push(task);
      }
    }

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const app = express();
app.use(express.json());
app.use('/v1', router);

export default app;
