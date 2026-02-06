export enum TaskType {
  RESEARCH = 'RESEARCH',
  CONTENT = 'CONTENT',
  DISTRIBUTION = 'DISTRIBUTION',
  REPLY_COMMENT = 'REPLY_COMMENT',
  GENERATE_CONTENT = 'GENERATE_CONTENT',
  EXECUTE_TRANSACTION = 'EXECUTE_TRANSACTION'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  FAILED = 'FAILED',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  QUEUED = 'QUEUED'
}

export enum GoalStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Task {
  taskId: string;
  type: TaskType;
  status: TaskStatus;
  data: any;
  priority: string | number;
  dependencies: string[];
  context?: any;
  created_at?: string;
}

export interface Goal {
  goalId: string;
  description: string;
  personaId: string;
  budget: number;
  priority: number;
}

export interface SwarmGoal extends Goal {
  status: GoalStatus;
  createdAt: string;
}

export interface AgentTask {
  taskId: string;
  goalId: string;
  type: TaskType;
  status: TaskStatus;
  input: any;
  version: number;
  context?: any;
}
