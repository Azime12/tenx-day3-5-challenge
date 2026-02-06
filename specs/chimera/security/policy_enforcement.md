# Security & Policy Specifications
**Project**: Chimera Autonomous Influencer Network
**Status**: APPROVED
**Source**: Derived from `specs/chimera/functional/srs.md`

## 1. Confidence-Based Governance Tiers

Every action proposed by a Judge Agent is categorized into one of three tiers based on the `confidence_score` (0.0 to 1.0) and `risk_level`.

### Tier 1: Auto-Approve (Low Friction)
- **Criteria**:
  - `confidence_score > 0.90`
  - `risk_level` is `low` or `medium`
  - Action is **NOT** financial.
  - Action is **NOT** sensitive content (politics, health).
- **Behavior**: The Orchestrator immediately executes the MCP side-effect.

### Tier 2: Async HITL Review (Human Review)
- **Criteria**:
  - `0.70 <= confidence_score <= 0.90`
  - OR `risk_level` is `high` (even if confidence is high).
- **Behavior**:
  - Task is moved to `status: awaiting_review`.
  - Item appears in Operator Dashboard.
  - Agent Swarm proceeds to *other* independent tasks (non-blocking).

### Tier 3: Reject / Retry (Correction)
- **Criteria**:
  - `confidence_score < 0.70`
- **Behavior**:
  - Task is marked as `failed` (attempt N).
  - Orchestrator triggers `retry` loop if `attempt < max_attempts`.
  - Previous feedback is fed into the next Worker iteration.

## 2. Mandatory HITL Overrides

Certain actions **ALWAYS** bypass Tier 1 and require human approval (Tier 2), regardless of AI confidence.

| Trigger Category | Description | Exception |
| :--- | :--- | :--- |
| **Financial** | Any wallet transaction > $0.00 (Spend, Transfer, Swap). | None. Zero-trust on money. |
| **Sensitive** | Topics tagged `politics`, `medical`, `legal_advice`. | None. |
| **New Platform** | First post on a newly connected social account. | After 10 successful posts, may degrade to Tier 1. |
| **Budget Cap** | Campaign budget utilization > 90%. | None. |

## 3. Financial & Wallet Safety (AgentKit)

### 3.1 Non-Custodial Standard
- All wallets are **non-custodial**.
- Private keys are **never** accessible to the Agent code directly.
- Signing happens inside the secure `skill_wallet_operation` via Coinbase AgentKit MCP.

### 3.2 Budget Governors
Every `Task` with a financial component MUST specify a `budget` constraint.
The `skill_wallet_operation` MUST enforce:
1.  **Check**: `requested_amount <= task_budget.max_value`
2.  **Check**: `requested_amount <= campaign_remaining_budget`
3.  **Check**: `daily_spend + requested_amount <= daily_limit` (Default: **$50 USD** equivalent per agent/day)

If any check fails, the operation triggers a `BUDGET_ALARM` error and halts.

## 4. Disclosure Policy
Agents must adhere to the **"Transparent AI"** policy.

1.  **Direct Inquiry**: If a user query contains phrases like "are you AI/real/a bot?", the agent MUST respond with: **"I am an autonomous digital entity created by Project Chimera. How can I assist you today?"**
2.  **Bio/Profile**: All managed profiles must contain "Managed by AI" or equivalent disclosure in the bio.
3.  **Generated Content**: High-risk media (deepfakes, realistic voices) MUST include metadata or watermarks indicating synthetic origin.
