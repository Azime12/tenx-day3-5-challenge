# Phase 1 Tasks: Core Swarm Foundation

This document defines the actionable tasks for the first phase of the Chimera Autonomous Influencer Network, following the ratified SRS and Constitution.

---

## [TASK-001] Python Environment & Dependency Setup
**Priority:** High
**Estimate:** 4h
**Dependencies:** None
**Acceptance Criteria:**
- Virtual environment (`.venv`) initialized with Python 3.11.
- `requirements.txt` contains `redis`, `sqlalchemy`, `pydantic`, `fastapi`, and `instructor`.
- Smoke test script validates that all imports work without error.

**Implementation Steps:**
1. Create a Python 3.11 virtual environment.
2. Draft `requirements.txt` with core swarm dependencies.
3. Install dependencies and verify environment isolation.
4. Create a `src/smoke_test.py` to verify environment readiness.

**Files to Create/Modify:**
- `requirements.txt`
- `src/smoke_test.py`

---

## [TASK-002] Docker Infrastructure for Redis & Postgres
**Priority:** High
**Estimate:** 8h
**Dependencies:** TASK-001
**Acceptance Criteria:**
- `docker-compose.yml` launches an authenticated Redis instance and a PostgreSQL 15 instance.
- Persistence is configured via Docker volumes.
- Connectivity script in Python validates connection to both services using environment variables.

**Implementation Steps:**
1. Create `docker-compose.yml` with Redis and Postgres service definitions.
2. Use environment variables for all credentials (consistent with constitution).
3. Implement `src/infrastructure/check_conn.py` to test Redis/Postgres connectivity.

**Files to Create/Modify:**
- `docker-compose.yml`
- `src/infrastructure/check_conn.py`

---

## [TASK-003] Abstract Agent Base Class & Lifecycle
**Priority:** High
**Estimate:** 1d
**Dependencies:** TASK-001
**Acceptance Criteria:**
- `BaseAgent` class includes `uuid`, `role`, and `status`.
- Lifecycle methods `setup()`, `run()`, and `teardown()` are implemented.
- Every agent action is wrapped in a telemetry logger consistent with [MCP-LOG] standards.

**Implementation Steps:**
1. Define `BaseAgent` in `src/agents/base.py`.
2. Implement standard lifecycle hooks and status transitions.
3. Add a `log_event()` method that formats logs with the required `[MCP-LOG]` prefix.

**Files to Create/Modify:**
- `src/agents/base.py`

---

## [TASK-004] Configuration & Secret Management
**Priority:** High
**Estimate:** 4h
**Dependencies:** TASK-002
**Acceptance Criteria:**
- Settings class (Pydantic-based) loads configuration from `.env`.
- Database URLs and Redis endpoints are not hardcoded.
- Validation fails immediately if critical secrets (e.g., `DATABASE_URL`) are missing.

**Implementation Steps:**
1. Create `src/config.py` using `pydantic-settings`.
2. Define a `.env.example` file with all required keys.
3. Implement a validation check at startup to ensure environment integrity.

**Files to Create/Modify:**
- `src/config.py`
- `.env.example`

---

## [TASK-005] Error Handling & Logging Framework
**Priority:** Medium
**Estimate:** 8h
**Dependencies:** TASK-003
**Acceptance Criteria:**
- Centralized logger configured for console and telemetry output.
- Custom exceptions (e.g., `SwarmError`, `OCCConflict`) are defined.
- Global exception handler captures unhandled agent failures and logs them via MCP tools.

**Implementation Steps:**
1. Setup standard Python logging with a custom formatter.
2. Create `src/system/exceptions.py`.
3. Implement `src/system/logger.py` to wrap telemetry logging.

**Files to Create/Modify:**
- `src/system/logger.py`
- `src/system/exceptions.py`

---

## [TASK-006] Planner: Goal Decomposition Logic
**Priority:** High
**Estimate:** 2d
**Dependencies:** TASK-003, TASK-005
**Acceptance Criteria:**
- `PlannerAgent` takes a high-level string (e.g., "Grow on Twitter") and produces a list of `Task` objects.
- Decomposition follows a JSON-schema based prompt via an LLM.
- Planner validates its own decomposition before submitting to the queue.

**Implementation Steps:**
1. Create `src/agents/planner.py` inheriting from `BaseAgent`.
2. Integrate an LLM provider (via MCP tool if possible) to decompose goals.
3. Define the `Goal` and `Task` structures using Pydantic.

**Files to Create/Modify:**
- `src/agents/planner.py`
- `src/models/tasks.py`

---

## [TASK-007] Task Creation & Redis Queueing
**Priority:** High
**Estimate:** 1d
**Dependencies:** TASK-002, TASK-006
**Acceptance Criteria:**
- `TaskQueue` client pushes tasks to a Redis List.
- Tasks contain metadata: `payload`, `version`, `retry_count`, and `deadline`.
- `Planner` successfully pushes a decomposed set of tasks to the queue.

**Implementation Steps:**
1. Implement `src/queues/task_queue.py` using `redis-py`.
2. Ensure task serialization/deserialization handles Pydantic models.
3. Add `push_task()` and `pop_task()` methods to the queue client.

**Files to Create/Modify:**
- `src/queues/task_queue.py`

---

## [TASK-008] Worker: Stateless Execution Engine
**Priority:** High
**Estimate:** 2d
**Dependencies:** TASK-007
**Acceptance Criteria:**
- `WorkerAgent` pops tasks from Redis and executes them using a generic handler.
- Workers are stateless; all state must be fetched and updated via `GlobalState`.
- Support for parallel execution (multiple worker instances) is validated.

**Implementation Steps:**
1. Create `src/agents/worker.py`.
2. Implement a task handler registry.
3. Ensure worker loops indefinitely until a shutdown signal is received.

**Files to Create/Modify:**
- `src/agents/worker.py`

---

## [TASK-009] Worker Retry Logic & Failure Handling
**Priority:** Medium
**Estimate:** 8h
**Dependencies:** TASK-008
**Acceptance Criteria:**
- Failed tasks are retried with exponential backoff (2s, 4s, 8s).
- After max retries, task is marked as `FAILED` and Planner is notified.
- Logs include full stack trace and task context for auditability.

**Implementation Steps:**
1. Implement retry checking in the Worker execution loop.
2. Update `Task` metadata to track retry attempts.
3. Integrate with the existing logging framework for failure reporting.

**Files to Create/Modify:**
- `src/agents/worker.py`

---

## [TASK-010] Judge: Confidence Scoring Logic
**Priority:** High
**Estimate:** 1d
**Dependencies:** TASK-008
**Acceptance Criteria:**
- `JudgeAgent` takes a completed task result and outputs a score (0.0 - 1.0).
- Scoring is based on a structured LLM rubric defined in the SRS section 4.1.
- Results with confidence < 0.7 are auto-rejected.

**Implementation Steps:**
1. Create `src/agents/judge.py`.
2. Implement the `score_result()` method using the LLM rubric.
3. Handle confidence-based routing (Auto-approve vs HITL vs Reject).

**Files to Create/Modify:**
- `src/agents/judge.py`

---

## [TASK-011] Optimistic Concurrency Control (OCC)
**Priority:** High
**Estimate:** 1d
**Dependencies:** TASK-010
**Acceptance Criteria:**
- `GlobalState` manages versioned objects.
- State updates fail if the version in storage is newer than the version held by the agent.
- Conflicts trigger an `OCCConflict` exception and a task retry by the Worker.

**Implementation Steps:**
1. Implement `src/state/global_state.py` with version checks.
2. Use Redis transactions or Lua scripts for atomic update-and-increment.
3. Integrate OCC check into the Worker's final state update step.

**Files to Create/Modify:**
- `src/state/global_state.py`

---

## [TASK-012] End-to-End Swarm Simulation
**Priority:** High
**Estimate:** 2d
**Dependencies:** TASK-011
**Acceptance Criteria:**
- `simulate_swarm.py` executes a full loop: Goal -> Planner -> Queue -> Worker -> Judge -> State.
- Logs demonstrate parallel worker activity and successful adjudication.
- A "conflict" scenario is simulated and handled by OCC.

**Implementation Steps:**
1. Create `simulate_swarm.py` script.
2. Mock an external trend resource via a local class (pre-MCP).
3. Record and display the full lifecycle of a single goal through the swarm.

**Files to Create/Modify:**
- `simulate_swarm.py`

---

## [TASK-013] Component Unit Testing (TDD)
**Priority:** Medium
**Estimate:** 3d
**Dependencies:** TASK-012
**Acceptance Criteria:**
- 80%+ code coverage for all agent classes and utility modules.
- Tests use `pytest` and mock external services (Redis/LLM).
- Test suite fails if any core swarm principle (e.g., OCC) is violated.

**Implementation Steps:**
1. Create `tests/` directory with `unit/` and `integration/` subfolders.
2. Write failing tests for each component before finalizing implementation.
3. Configure `pytest` to run as part of the local verification step.

**Files to Create/Modify:**
- `tests/unit/test_agents.py`
- `tests/unit/test_queue.py`
- `tests/unit/test_state.py`
