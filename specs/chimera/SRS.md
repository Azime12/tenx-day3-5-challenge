# Software Requirements Specification (SRS)
## Project Chimera: Autonomous Influencer Network
**Version:** 1.0
**Date:** February 6, 2026
**Status:** PROPOSED

---

## 1. Introduction & System Overview

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the definitive architectural, functional, and operational blueprints for **Project Chimera**. It serves as the sole source of truth for the development of the AiQEM Autonomous Influencer Network. This document supersedes all prior specifications.

### 1.2 Scope
Project Chimera aims to transition from automated content scheduling to the creation of **Autonomous Influencer Agents**. These agents are persistent, goal-directed digital entities capable of perception, reasoning, creative expression, and economic agency.

The system encompasses:
- **Hierarchical Swarm Architecture**: Using the "FastRender" pattern (Planner, Worker, Judge).
- **Model Context Protocol (MCP)**: For universal connectivity to external tools and resources.
- **Agentic Commerce**: Integration with Coinbase AgentKit for on-chain financial autonomy.
- **Business Models**:
    1.  **Digital Talent Agency**: Proprietary fleet of AI influencers.
    2.  **Platform-as-a-Service (PaaS)**: Infrastructure for third-party brands.
    3.  **Hybrid Ecosystem**: "Alpha" fleet + developer ecosystem.

### 1.3 Definitions, Acronyms, and Abbreviations
- **Chimera Agent**: A sovereign digital entity with a unique persona (`SOUL.md`), hierarchical memory, and a crypto wallet.
- **Orchestrator**: The central control plane managing the agent fleet.
- **MCP (Model Context Protocol)**: Standard for AI interaction with external data (Resources) and functionality (Tools).
- **FastRender Pattern**: A swarm coordination architecture splitting cognition into **Planner** (Strategy), **Worker** (Execution), and **Judge** (Quality/Safety).
- **OCC (Optimistic Concurrency Control)**: Non-locking state management where agents operate on local snapshots and validate upon commit.
- **Agentic Commerce**: Autonomous execution of financial transactions via blockchain wallets.
- **HITL (Human-in-the-Loop)**: Governance framework for human review of low-confidence or sensitive actions.

---

## 2. Overall Architecture

### 2.1 System Context Diagram
The system follows a **Hub-and-Spoke** topology. The Central Orchestrator (Hub) manages state and governance, while Agent Swarms (Spokes) execute tasks. All external interactions occur via the MCP Layer.

```mermaid
graph TD
    User[Network Operator] -->|Dashboard| Orchestrator
    
    subgraph "Project Chimera Cloud"
        Orchestrator[Central Orchestrator]
        Database[(PostgreSQL / Weaviate)]
        Redis[(Redis Queue)]
        
        subgraph "Agent Swarm (FastRender Pattern)"
            Planner[Planner Agent]
            Worker[Worker Agent]
            Judge[Judge Agent]
        end
    end
    
    subgraph "External World (via MCP)"
        MCP_Server1[Twitter/X MCP Server]
        MCP_Server2[News Feed MCP Server]
        MCP_Server3[Coinbase AgentKit]
    end
    
    Orchestrator --> Planner
    Planner -->|Task| Redis
    Redis -->|Task| Worker
    Worker -->|Result| Redis
    Redis -->|Result| Judge
    Judge -->|Commit/Retry| Orchestrator
    
    Worker -->|MCP Protocol (SSE/Stdio)| MCP_Server1
    Worker -->|MCP Protocol| MCP_Server2
    Worker -->|MCP Protocol| MCP_Server3
```

### 2.2 User Characteristics
- **Network Operators (Strategic Managers)**: Define high-level campaigns and goals. Moderate technical proficiency. Use the Orchestrator Dashboard.
- **Human Reviewers (HITL Moderators)**: Review flagged content. Focus on brand safety. use Review Interface.
- **Developers & System Architects**: Extend system capabilities (new MCP servers, system prompts). High technical proficiency.

### 2.3 Operational Environment
- **Compute**: Hybrid cloud (AWS/GCP), Kubernetes (K8s) for container orchestration.
- **AI Inference**: 
    - **Reasoning**: Gemini 3 Pro / Claude Opus 4.5.
    - **Routine**: Gemini 3 Flash / Haiku 3.5.
- **Data Persistence**:
    - **Semantic Memory**: Weaviate (Vector DB).
    - **Transactional**: PostgreSQL.
    - **Episodic Cache**: Redis.
    - **Ledger**: On-chain (Base, Ethereum, Solana).

---

## 3. Detailed Functional Requirements

### 3.1 Cognitive Core & Persona management
**FR 1.0: Persona Instantiation via SOUL.md**
The system SHALL support the definition of agent personas via a standardized `SOUL.md` configuration file. This file must contain:
- **Backstory**: Narrative history.
- **Voice/Tone**: Stylistic guidelines.
- **Core Beliefs**: Ethical/behavioral guardrails.
- **Directives**: Hard constraints.

**FR 1.1: Hierarchical Memory Retrieval**
The system SHALL implement a multi-tiered memory retrieval process:
1.  **Short-Term**: Fetch recent history from Redis (last 1 hour).
2.  **Long-Term**: Query Weaviate for semantic matches to current context.
3.  **Context Construction**: Dynamically assemble a system prompt injecting `SOUL.md`, short-term history, and relevant long-term memories via MCP Resources.

**FR 1.2: Dynamic Persona Evolution**
The system SHALL enable "learning" by having the Judge trigger a background process to summarize successful interactions and update the immutable memories in Weaviate.

### 3.2 Perception System (Data Ingestion)
**FR 2.0: Active Resource Monitoring**
The system SHALL implement a polling mechanism to continuously check MCP **Resources** for updates (e.g., `twitter://mentions/recent`, `news://ethiopia/fashion/trends`).

**FR 2.1: Semantic Filtering**
The system SHALL filter ingested content using a lightweight LLM (e.g., Gemini Flash) to score relevance. Only content exceeding a configurable **Relevance Threshold** triggers a Planner task.

**FR 2.2: Trend Detection**
The system SHALL support a background Worker that analyzes aggregated data to detect clusters/trends and generate "Trend Alerts".

### 3.3 Creative Engine (Content Generation)
**FR 3.0: Multimodal Generation via MCP Tools**
The system SHALL utilize specialized MCP Tools for content generation:
- **Text**: Native LLM.
- **Images**: `mcp-server-ideogram`, `mcp-server-midjourney`.
- **Video**: `mcp-server-runway`.

**FR 3.1: Character Consistency Lock**
The system SHALL enforce character consistency by automatically injecting a `character_reference_id` or LoRA into image generation tool calls.

**FR 3.2: Hybrid Video Rendering**
The system SHALL implement a tiered strategy:
- **Tier 1 (Daily)**: Image + Motion Brush (Living Portraits).
- **Tier 2 (Hero)**: Full Text-to-Video.

### 3.4 Action System (Social Interface)
**FR 4.0: Platform-Agnostic Publishing**
The system SHALL execute all social actions (post, reply, like) via MCP Tools. Direct API calls are prohibited to ensure governance and standardization.

**FR 4.1: Bi-Directional Interaction Loop**
The system SHALL support the full loop:
1.  **Ingest** (Planner via MCP Resource).
2.  **Plan** (Planner creates Reply Task).
3.  **Generate** (Worker generates content).
4.  **Act** (Worker calls MCP publishing tool).
5.  **Verify** (Judge confirms safety).

### 3.5 Agentic Commerce
**FR 5.0: Non-Custodial Wallet Management**
Each agent SHALL be assigned a unique non-custodial wallet via **Coinbase AgentKit**.
**Security Constraint**: Wallet private keys MUST be stored in a dedicated secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault). The key is injected as an environment variable only at the runtime initialization of the agent's commerce module and must never be logged, stored in code, or written to disk.

**FR 5.1: Autonomous Actions**
The system SHALL support:
- `native_transfer`: Sending assets.
- `deploy_token`: ERC-20 deployment.
- `get_balance`: Financial health check.

**FR 5.2: Budget Governance (The "CFO")**
A specialized **"CFO" Judge** SHALL review every transaction.

**Resource Governor**:
A dedicated service SHALL track spending per agent against a daily/weekly budget using a **token-bucket algorithm**.
- **At 80% Usage**: Alert Planner to deprioritize non-essential tasks.
- **At 100% Usage**: Block all new cost-incurring tasks for that agent.

### 3.6 Orchestration & Swarm Governance
**FR 6.0: Planner-Worker-Judge Implementation**
The system SHALL implement the three roles as decoupled services communicating via Redis queues (`task_queue`, `review_queue`).

**FR 6.1: Optimistic Concurrency Control (OCC)**
The Judge SHALL implement OCC. Upon committing a result, it checks a `state_version`. If the state has successfully drifted, the result is invalidated to prevent race conditions.

**Failure Handling & Escalation**:
- **First Failure**: Worker logs error, task marked 'failed'. Planner re-queues with same parameters (Max 2 retries).
- **Third Failure**: Planner marks task 'blocked', creates 'incident' alert, and escalates to Orchestrator Dashboard for human review.

---

## 4. Non-Functional & Interface Requirements

### 4.1 HITL & Confidence Framework
**NFR 1.0: Confidence Scoring**
Every Worker action SHALL include a `confidence_score` (0.0 - 1.0).

**NFR 1.1: Automated Escalation Logic**
- **High (> 0.90)**: Auto-Approve.
- **Medium (0.70 - 0.90)**: Async Approval (Queue for Dashboard).
- **Low (< 0.70)**: Reject/Retry.

**NFR 1.2: Sensitive Topic Filters**
Content triggering sensitive topic filters (Politics, Financial Advice) MUST be routed to HITL regardless of confidence.

### 4.2 Ethical & Transparency Framework
**NFR 2.0: Automated Disclosure**
Published media SHALL use platform-native AI labeling features where available.

**NFR 2.1: Identity Protection & Honesty**
If queried "Are you a robot?", the agent MUST provide this exact verbatim response:
> "I am a virtual persona powered by AI, created as part of Project Chimera. My goal is to provide engaging and relevant content. How can I help you today?"
This directive overrides all other persona constraints.

### 4.3 Performance & Scalability
**NFR 3.0: Scalability**
The system SHALL support auto-scaling of Worker Nodes to handle 1,000+ concurrent agents.

**NFR 3.1: Latency**
High-priority interactions (e.g., DM replies) SHALL require < 10 seconds end-to-end latency.

### 4.4 Data Models

**Schema 1: The Agent Task (JSON)**
```json
{
  "task_id": "uuid-v4",
  "task_type": "generate_content | reply | transaction",
  "priority": "high | medium | low",
  "context": {
    "goal": "string",
    "constraints": ["string"],
    "resources": ["mcp://twitter/mentions/123"]
  },
  "assigned_worker_id": "string",
  "status": "pending | in_progress | complete"
}
```

**Schema 2: MCP Tool Definition (JSON Schema)**
```json
{
  "name": "post_content",
  "description": "Publishes to social platform",
  "inputSchema": {
    "type": "object",
    "required": ["platform", "content"],
    "properties": {
      "platform": {"type": "string", "enum": ["twitter", "instagram"]},
      "content": {"type": "string"},
      "media_urls": {"type": "array", "items": {"type": "string"}}
    }
  }
}
```

---

## 5. Implementation Roadmap & Genesis Prompts

### 5.1 Phase 1: Core Swarm
**Objective**: Establish Planner-Worker-Judge loop and Redis infrastructure.
**Genesis Prompt**:
> "Create a Python project with `planner`, `worker`, and `judge` services. Use `pydantic` for Task/Result models and `redis-py` for queuing. Implement a flow where Planner creates tasks from `goals.json`, Worker processes them (mock sleep), and Judge validates them."

### 5.2 Phase 2: MCP Integration
**Objective**: Connect swarm to external tools via MCP.
**Genesis Prompt**:
> "Integrate `mcp` SDK. Create an `MCPClient` class that builds an SSE connection to a remote MCP server defined in `.cursor/mcp.json`. Implement `call_tool` and `list_tools` methods."

### 5.3 Phase 3: Agentic Commerce
**Objective**: Enable financial autonomy.
**Genesis Prompt**:
> "Integrate `coinbase-agentkit`. Create a `WalletProvider` class initialized with env vars. Implement a `transfer` capability and a decorator `@budget_check` that queries a Redis key for daily spend limits before executing."
