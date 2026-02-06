# Data Model: Project Chimera Swarm

## Entities

### 1. SwarmGoal
Represents the top-level objective decomposed by the Planner.
- `goalId`: UUID (Primary Key)
- `description`: String (Natural language objective)
- `status`: Enum (PENDING, ACTIVE, COMPLETED, FAILED)
- `priority`: Integer (1-5)
- `createdAt`: Timestamp
- `metadata`: JSONB (Context-specific parameters)

### 2. AgentTask
An abstract unit of work assigned to Workers.
- `taskId`: UUID (Primary Key)
- `goalId`: UUID (Foreign Key -> SwarmGoal)
- `type`: Enum (RESEARCH, SYNTHESIS, CONTENT, WALLET, ADJUDICATION)
- `workerId`: String (Assigned Worker)
- `status`: Enum (QUEUED, IN_PROGRESS, REVIEW, DONE, ERROR)
- `input`: JSONB (Task parameters)
- `output`: JSONB (Worker result)
- `confidenceScore`: Float (Assigned by Judge)
- `version`: Integer (Optimistic Concurrency Control)

### 3. EconomicBudget
Tracks spending limits per agent/instance.
- `agentId`: String (Primary Key)
- `dailyLimit`: Decimal (Default: 50.00)
- `dailySpent`: Decimal
- `weeklyLimit`: Decimal (Default: 200.00)
- `weeklySpent`: Decimal
- `lastReset`: Timestamp (UTC 00:00)

### 4. PersonaContext (Weaviate)
Vector representation of the influencer shadow.
- `vector`: Float[] (768/1536 dims)
- `content`: String (Source text/sentiment)
- `source`: Enum (TWEET, DM, SYSTEM_PROMPT)
- `userId`: String (Optional, for personalized recall)

### 5. UserRelationshipState (PostgreSQL)
Tracks follower interactions.
- `userId`: String (Primary Key)
- `handle`: String
- `interactionCount`: Integer
- `sentimentScore`: Float
- `lastInteraction`: Timestamp
- `notes`: String (Personalized context for RAG)

## State Transitions (AgentTask)
1. `QUEUED` -> `IN_PROGRESS` (Worker lock acquired via Redis Lua)
2. `IN_PROGRESS` -> `REVIEW` (Worker submits result)
3. `REVIEW` -> `DONE` (Judge confidence > 0.90)
4. `REVIEW` -> `QUEUED` (Judge confidence < 0.70 AND retry_limit not reached)
5. `REVIEW` -> `ERROR` (Critical failure or Judge Reject)
