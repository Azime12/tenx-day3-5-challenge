# Technical API Contracts
**Project**: Chimera Autonomous Influencer Network
**Status**: APPROVED
**Source**: Derived from `specs/chimera/functional/srs.md`

## 1. Domain Object Schemas

These Objects form the core data exchange protocol between Planner, Worker, and Judge.

### 1.1 Task Object (Planner -> Orchestrator -> Worker)
Represents a unit of work to be performed.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "chimera.task.schema.json",
  "title": "Task",
  "type": "object",
  "required": ["task_id", "skill", "objective", "constraints", "risk_level"],
  "properties": {
    "task_id": { "type": "string" },
    "skill": {
      "type": "string",
      "enum": ["skill_trend_research", "skill_content_generate", "skill_wallet_operation"]
    },
    "objective": { "type": "string", "description": "High level goal for the agent" },
    "input_params": {
        "type": "object",
        "description": "Skill-specific input parameters conforming to the Skill Contract"
    },
    "constraints": {
      "type": "object",
      "required": ["mcp_only", "no_secrets"],
      "properties": {
        "mcp_only": { "type": "boolean", "const": true },
        "no_secrets": { "type": "boolean", "const": true },
        "budget": {
            "type": "object",
            "properties": {
                "max_value": { "type": "number" },
                "currency": { "type": "string" }
            }
        }
      }
    },
    "risk_level": { "type": "string", "enum": ["low", "medium", "high", "financial", "sensitive"] },
    "requires_human_review": { "type": "boolean" },
    "correlation_id": { "type": "string", "description": "Trace ID for audit" }
  }
}
```

### 1.2 Result Object (Worker -> Judge)
Represents the outcome of a Task execution.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "chimera.result.schema.json",
  "title": "Result",
  "type": "object",
  "required": ["result_id", "task_id", "status", "artifacts", "evidence"],
  "properties": {
    "result_id": { "type": "string" },
    "task_id": { "type": "string" },
    "status": { "type": "string", "enum": ["success", "error", "blocked", "partial"] },
    "artifacts": {
      "type": "object",
      "description": "The actual output of the skill (e.g. video file, trend list)"
    },
    "evidence": {
      "type": "object",
      "required": ["mcp_actions"],
      "properties": {
        "mcp_actions": {
          "type": "array",
          "items": {
             "type": "object",
             "required": ["server", "action", "timestamp"],
             "properties": {
                 "server": { "type": "string" },
                 "action": { "type": "string" },
                 "timestamp": { "type": "string" }
             }
          }
        },
        "sources": { "type": "array", "items": { "type": "string" } }
      }
    },
    "error": {
        "type": "object",
        "properties": {
            "code": { "type": "string" },
            "message": { "type": "string" },
            "retryable": { "type": "boolean" }
        }
    }
  }
}
```

## 2. Orchestrator API (Dashboard & Ops)

### 2.1 Task Management
`GET /api/v1/tasks`
- **Query Params**: `tenant_id`, `status`, `risk_level`
- **Response**: List of Task objects

`GET /api/v1/tasks/{task_id}`
- **Response**: Full Task details + Link to Result + Link to Judge Evaluation

`POST /api/v1/tasks/{task_id}/retry`
- **Body**: `{ "reason": "operator_override" }`
- **Description**: Manually triggers a retry if `max_attempts` allows.

### 2.2 Human Review (HITL)
`GET /api/v1/review-queue`
- **Response**: List of pending evaluations requiring human attention.

`POST /api/v1/review-queue/{item_id}/decision`
- **Body**:
```json
{
  "decision": "approve" | "reject" | "edit_and_approve",
  "reviewer_id": "user_123",
  "rationale": "Content is safe.",
  "edits": { ... } // Optional overrides for artifacts
}
```

### 2.3 System Health
`GET /api/v1/health`
- **Response**:
```json
{
  "orchestrator": "ok",
  "mcp_connections": {
      "social": "connected",
      "finance": "connected"
  },
  "queue_depth": 12
}
```
