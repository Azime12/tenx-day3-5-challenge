# Tasks: Project Chimera (Autonomous Influencer Network)

**Feature**: [spec.md](file:///c:/Users/hp/Desktop/ten10/chimira other part/.specify/memory/specs/001-chimera-network/spec.md) | **Branch**: `001-chimera-network`

## Implementation Strategy
This plan follows a TDD-enabled (TDD requested in Constitution) approach to build the core Hierarchical Swarm. We will first establish the Redis-backed orchestration foundation, followed by the P1 User Stories (Trend Engagement & HITL Safety), and finally the P2 Economic Sovereignty.

## Phase 1: Environment Setup
- [x] T001 Initialize project structure and `package.json` with dependencies
- [x] T002 Configure TypeScript and `tsconfig.json` for Node.js 20+
- [x] T003 [P] Setup Docker Compose for Redis, Weaviate, and PostgreSQL
- [x] T004 Create `.env.template` with CDP and Social API placeholders

## Phase 2: Foundational Infrastructure
- [x] T005 [P] Implement Redis connection client with Lua script support in `src/common/redis.ts`
- [x] T006 [P] Create PostgreSQL schema for UserRelationshipState in `src/common/db.ts`
- [x] T007 [P] Initialize Weaviate vector client in `src/common/weaviate.ts`
- [x] T008 Implement MCP Base Telemetry logging in `src/telemetry/mcp_logger.ts`
- [x] T009 [P] Create shared OpenClaw types for Goal/Task in `src/common/types.ts`

## Phase 3: [US3] Human-in-the-Loop Safety (P1)
*Goal: Ensure all actions pass 90/70 confidence gates via the Judge.*
- [x] T010 [US3] Create Judge component with confidence scoring logic in `src/orchestrator/judge.ts`
- [x] T011 [P] [US3] Implement HITL Queue persistence in Redis/PostgreSQL
- [x] T012 [US3] Create `/tasks/{taskId}/adjudicate` endpoint in `src/orchestrator/api.ts`
- [x] T013 [P] [US3] Create `/hitl/queue` monitoring endpoint in `src/orchestrator/api.ts`
- [x] T014 [US3] Write integration test for auto-reject vs review flow in `tests/integration/safety.test.ts`

## Phase 4: [US1] Autonomous Trend Engagement (P1)
*Goal: Identify trends and generate influencer content.*
- [x] T015 [US1] Implement Planner logic for goal decomposition in `src/orchestrator/planner.ts`
- [x] T016 [P] [US1] Create `/goals` creation endpoint in `src/orchestrator/api.ts`
- [x] T017 [US1] Implement Trend Worker with Twitter MCP integration in `src/workers/trend-worker.ts`
- [x] T018 [P] [US1] Implement Content Worker with LLM-based generation in `src/workers/content-worker.ts`
- [x] T019 [P] [US1] Implement Persona Context RAG via Weaviate in `src/skills/memory_skill.ts`
- [x] T020 [US1] Write end-to-end test for Trend -> Content -> Judge cycle in `tests/integration/swarm_loop.test.ts`

## Phase 5: [US2] Economic Sovereignty (P2)
*Goal: Secure wallet operations with budget enforcement.*
- [x] T021 [US2] Integrate Coinbase AgentKit in `src/skills/coinbase_mcp.ts`
- [x] T022 [US2] Implement EconomicBudget counter logic (OCC protected) in `src/orchestrator/cfo_judge.ts`
- [x] T023 [P] [US2] Implement Wallet Skill for non-custodial transaction signing
- [x] T024 [US2] Write unit tests for $50/$200 daily/weekly limit enforcement

## Phase 6: Polish & Cross-Cutting
- [x] T025 [P] Implement AI nature disclosure override in all worker personas
- [x] T026 Setup CI/CD pipeline for TDD verification and MCP telemetry checks

## Phase 7: TDD Refinement & Verification
- [x] T027 Establish failing test baseline for Safety Integration
- [ ] T028 Iteratively fix tests following Red-Green-Refactor

## Dependencies
1. **Foundational (Phase 2)** must be complete before any User Story.
2. **Phase 3 (HITL)** is a prerequisite for **Phase 5 (Economic)** to ensure safety gates.
3. **Phase 4 (Trend)** can run in parallel with **Phase 3** implementation.

## Parallel Execution Examples
- **T005 - T007**: Database clients can be built simultaneously.
- **T012 - T013**: Orchestrator API endpoints can be developed in parallel.
- **T017 - T019**: Specialized Workers and Skills can be implemented by different sub-agents.
