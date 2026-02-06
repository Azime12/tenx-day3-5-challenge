# Project Chimera: Implementation Plan

**Objective:** Build a scalable, autonomous influencer network ("The Swarm") with a unified Planner-Worker-Judge architecture, connected to the world via MCP and governed by strict OCC.

**Core Principle:** Each phase produces a verifiable, integrated deliverable—a "vertical slice" of the system that works end-to-end.

---

## Phase 0: Foundation & Tooling (Week 0)
**Objective:** Set up the unbreakable development environment and governance tools.

### Key Deliverables
1.  **Repository & SDD Setup**
    *   [ ] Git repo structure initialized: `specs/`, `src/`, `skills/`, `tests/`
    *   [ ] `specs/constitution.md` and `specs/chimera/master-specification.md` firmly established as source of truth.
2.  **Development Environment**
    *   [ ] `pyproject.toml` configured with dependencies:
        *   `fastapi`, `pydantic` (Core)
        *   `mcp`, `coinbase-agentkit` (Connectivity)
        *   `weaviate-client`, `redis` (State & Memory)
    *   [ ] Docker environment: `Dockerfile` and `docker-compose.yml` for local services (Postgres, Redis, Weaviate mock).
3.  **Governance Automation**
    *   [ ] `Makefile` created with targets:
        *   `make spec-check`: Validates code against specs.
        *   `make test`: Runs TDD tests.
        *   `make deploy-local`: Spins up local environment.
    *   [ ] Pre-commit hook installed to block commits without updated specs.

### Success Criteria
*   [ ] A new developer can run `git clone`, `make setup`, and have all tools running.
*   [ ] `make test` runs and passes (even if no tests exist yet, it shouldn't fail).

---

## Phase 1: The Core Swarm Loop (Week 1-2)
**Objective:** Implement the beating heart of Chimera—the Planner-Worker-Judge cycle with OCC.

### Key Deliverables
1.  **Agent Base Classes**
    *   [ ] `src/agents/base.py`: Abstract `BaseAgent` class with lifecycle methods.
    *   [ ] Concrete `Planner`, `Worker`, `Judge` classes with core logic stubs.
2.  **State & Queue Management**
    *   [ ] `GlobalState` class (Dict/Redis backed) with version stamps for Optimistic Concurrency Control (OCC).
    *   [ ] `TaskQueue` and `ResultQueue` implementations.
3.  **Integrated Simulation**
    *   [ ] `simulate_swarm.py`: Script to mock a goal, run it through Planner->Worker->Judge, and log OCC validation.

### Success Criteria
*   [ ] `simulate_swarm.py` runs successfully.
*   [ ] Logs demonstrate task creation, execution, judgment, and state commitment.
*   [ ] OCC version conflict simulated and handled correctly.

---

## Phase 2: Perception & Skills via MCP (Week 3-4)
**Objective:** Connect the swarm to the outside world through MCP and build the first skill.

### Key Deliverables
1.  **MCP Client Integration**
    *   [ ] `src/mcp/client.py`: Wrapper to discover and call tools/resources from local MCP server.
2.  **First MCP Server**
    *   [ ] `mcp-server-twitter` (Mock): Exposes `fetch_trends` Tool and `twitter://mentions` Resource.
3.  **First Skill Implementation**
    *   [ ] `skills/trend_research/`: Function `fetch()` calling MCP tool, formatting data, handling errors.
4.  **Integrated Test**
    *   [ ] System can trigger from `twitter://mentions` polling.
    *   [ ] Planner creates "research trend" task.
    *   [ ] Worker executes using `trend_research` skill.

### Success Criteria
*   [ ] Swarm autonomously reacts to simulated external event.
*   [ ] Structured trend analysis produced from MCP data.

---

## Phase 3: Agentic Commerce & HITL Dashboard (Week 5-6)
**Objective:** Enable economic agency and the human safety layer.

### Key Deliverables
1.  **Wallet Integration**
    *   [ ] `src/commerce/manager.py`: `CommerceManager` using `CdpEvmWalletProvider`.
    *   [ ] Env var key loading, `get_balance`, `transfer` methods.
2.  **CFO Judge**
    *   [ ] `Judge` subclass for transaction interception.
    *   [ ] `budget.yaml` configuration check (approve/reject logic).
3.  **HITL Dashboard Stub**
    *   [ ] `src/orchestrator/dashboard.py`: FastAPI app.
    *   [ ] Endpoint `/api/review_queue`: Lists tasks awaiting human review.
4.  **Integrated Test**
    *   [ ] Worker proposes payment -> CFO Judge approves/rejects.
    *   [ ] Low-confidence task -> Appears in HITL dashboard.

### Success Criteria
*   [ ] Financial autonomy demonstrated with budget guardrails.
*   [ ] Human oversight interface functional for review queue.

---

## Phase 4: Scaling & Production Readiness (Week 7-8)
**Objective:** Prepare the system for deployment and multiple agents.

### Key Deliverables
1.  **Containerization & Orchestration**
    *   [ ] Docker containers for each component (Planner, Worker, Judge, Dashboard).
    *   [ ] `docker-compose.prod.yml`: Multi-service architecture definition.
2.  **Observability**
    *   [ ] Structured logging (`structlog`) and metrics (`Prometheus`) integrated.
    *   [ ] Health checks for all services.
3.  **CI/CD Pipeline**
    *   [ ] `.github/workflows/ci.yml`: Runs `make spec-check`, `make test`, `make security-scan`.
4.  **Load Test**
    *   [ ] Simulation script for 10 concurrent agents.

### Success Criteria
*   [ ] System starts with one command.
*   [ ] CI/CD passes on commit.
*   [ ] Concurrency handled without crashing.

---

## Phase 5: Alpha Release & Documentation (Week 9)
**Objective:** Package a demonstrable Alpha and complete the knowledge base.

### Key Deliverables
1.  **Alpha Deployment Guide**
    *   [ ] `docs/ALPHA_DEPLOYMENT.md`: Step-by-step cloud deployment guide.
2.  **Architecture Deep Dive**
    *   [ ] `docs/ARCHITECTURE.md`: Diagrams and explanation of Swarm, OCC, MCP.
3.  **"Chimera in 5 Minutes" Demo**
    *   [ ] `demo_alpha.py`: Script showcasing full flow (trend -> content -> simulated engagement -> reaction).
4.  **Final Spec Audit**
    *   [ ] Review of `specs/` vs built system.

### Success Criteria
*   [ ] External party can deploy and run Alpha using the guide.
*   [ ] Complete documentation of system value and construction.
