# Project Chimera Architecture Strategy

## 1. Agent Pattern: Hierarchical Swarm (FastRender)
The system implements a **Hierarchical Swarm pattern**, also known as **FastRender**, chosen for its scalability and robustness in autonomous environments.

- **Parallel Execution**: Capable of orchestrating 1000+ agents simultaneously by decoupling task planning from execution.
- **Quality Control (Judge Layer)**: Every worker output is validated by a specialized Judge agent before state transitions occur.
- **Self-Healing**: The Planner agent monitors execution health and performs dynamic re-planning if dependencies or specific worker nodes fail.

## 2. Human-in-the-Loop (HITL) Implementation
Safety is enforced through a multi-tier HITL system:

- **Confidence Thresholds**:
    - **< 0.70**: Mandatory blocking. Task is routed to the Async Approval Queue in the Orchestrator Dashboard.
    - **0.70 - 0.90**: Recommended review. Task proceeds but is flagged for audit.
    - **> 0.90**: Auto-approve for high-confidence routine tasks.
- **Topic Filtering**: Automated scans for sensitive topics (politics, high-stakes finance, health) trigger mandatory escalation regardless of confidence score.
- **Dashboards**: A centralized UI for human overseers to batch-approve or reject pending swarm actions.

## 3. Database Design
- **Weaviate**: Primary **Vector Database** for semantic memory. Stores influencer personas, core values, and interaction history for RAG-driven consistency.
- **PostgreSQL**: Stores **Transactional Data**, including user relationship states, campaign metadata, and audit logs.
- **Redis**: Serves as the **Episodic Cache** and high-throughput **Task Queue**, managing the real-time swarm lifecycle.
- **Blockchain**: Provides an immutable **On-chain Ledger** for all financial and high-value agentic commerce via Coinbase AgentKit.

## 4. MCP Integration Strategy
- **Topology**: Hub-and-Spoke. The central Orchestrator acts as the Host, coordinating multiple MCP Servers.
- **Server Registry**:
    - **Twitter MCP**: Social engagement.
    - **Weaviate MCP**: Long-term memory retrieval.
    - **Coinbase MCP**: Economic operations and wallet management.
- **Abstraction**: Standardizes Tools, Resources, and Prompts across all agent roles, ensuring the swarm remains provider-agnostic.
