# Chimera Autonomous Influencer Network Constitution (RATIFIED)

## Core Principles

### I. Spec-Driven Development (Strict)
All project changes must be defined in the Specification before implementation. All commits must wear the `[MCP-LOG]` prefix. A TDD approach is mandatory: failing tests must be written and approved before implementation begins.

### II. MCP-First Architecture & Telemetry
All external APIs must be abstracted through MCP servers. No hardcoded secrets are permitted; environment-based configuration is the only allowed method. Every agent action and system event must be telemetry-logged via the MCP layer.

### III. Agentic Commerce & Financial Sovereignty
The network utilizes Coinbase AgentKit for autonomous commerce with non-custodial wallets. All entities are designed for financial autonomy, maintaining their own economic state and executing transactions according to the established safety tiers.

### IV. Hierarchical Swarm (FastRender)
The system follows a Planner-Worker-Judge hierarchical pattern. Communication utilizes OpenClaw protocols with Optimistic Concurrency Control to ensure high throughput and consistency across the swarm.

### V. Three-Tier HITL Safety
Decision-making follows a strict risk-based tiering system monitored by a CFO Judge sub-agent:
- **High Confidence**: >0.90 (Auto-approve)
- **Medium Confidence**: 0.70 - 0.90 (Route to Async HITL review queue)
- **Low Confidence**: <0.70 (Auto-Reject, trigger task replanning by Planner)
Agents must disclose their AI nature verbatim whenever asked (see Phrasing in SRS).

## Scalability & Performance Standards
- **Target**: 1000+ concurrent agents operating in parallel swarms.
- **Optimization**: FastRender pattern enforced to prevent adjudicator bottlenecks.

## Development Workflow
- **Spec-First**: `/speckit.plan` requires 100% alignment with this constitution.
- **TDD Requirement**: Failing tests MUST be written and approved before implementation.
- **Logging**: All commits MUST use the `[MCP-LOG]` prefix.

## Governance & Precedence
This constitution is the **Primary Source of Truth**. In the event of a conflict:
1. **Constitution** (This document)
2. **Software Requirements Specification** (SRS)
3. **Implementation Plan**
4. **Actionable Tasks**

Amendments require a formal Sync Impact Report and verification against the Hierarchical Swarm pattern. All economic transactions MUST pass the Three-Tier HITL safety gates.

**Version**: 1.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06
