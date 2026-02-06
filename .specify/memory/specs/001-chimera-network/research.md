# Research: Project Chimera Swarm Foundation

**Date**: 2026-02-06
**Context**: [001-chimera-network](file:///c:/Users/hp/Desktop/ten10/chimira%20other%20part/.specify/memory/specs/001-chimera-network/spec.md)

## Decisions & Rationale

### 1. Swarm Orchestration Engine
- **Decision**: Custom Orchestrator utilizing `ioredis` for task queuing and state persistence.
- **Rationale**: Standard frameworks (e.g., LangChain) introduce overhead that may violate the 10-second cycle requirement. A custom Redis-based queue with Lua scripts ensures Optimistic Concurrency Control (OCC) and ultra-low latency.
- **Alternatives**: Temporal (too heavy for MVP), LangGraph (high latency for 1000+ concurrent agents).

### 2. Telemetry & Observation
- **Decision**: MCP-native telemetry logging.
- **Rationale**: Aligning with Constitution Item II. Every tool call and state transition is captured as an MCP event, allowing for real-time CFO Judge monitoring and safety audit.
- **Alternatives**: Prometheus/Grafana (complementary, not primary for agent-level audit).

### 3. Financial Safety (CFO Judge)
- **Decision**: Redis-backed budget counters with circuit-breaking.
- **Rationale**: Ensures $50/$200 limits are enforced across distributed workers. CFO Judge sub-agent verifies every "Wallet Call" against current counters before execution.
- **Alternatives**: Per-transaction local checks (subject to race conditions without OCC).

## Best Practices

- **MCP Protocol**: Use `LSP`-style communication for tool invocation to ensure strictly typed responses.
- **Safety Tiers**: Confidence scores MUST be derived from LLM logprobs or ensemble voting in the Judge layer.
