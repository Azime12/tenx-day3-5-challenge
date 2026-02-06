# Project Chimera 2026 Edition - Master Specification

## PROJECT CONTEXT
**Project**: Autonomous Influencer Network  
**Framework**: Antigravity + TypeScript + MCP  
**Pattern**: FastRender Swarm (Planner/Worker/Judge)  
**Business Model**: Digital Talent Agency + PaaS + Hybrid Ecosystem  
**Agents**: Gemini 2.0 (Thinking/Flash/Pro), Claude Opus 4.5  
**Deadline**: February 6, 2026  

## ARCHITECTURAL PRINCIPLES
1. **Spec-Driven Development**: No code without ratified spec
2. **MCP-First**: All external interactions via Model Context Protocol
3. **Swarm Architecture**: Planner decomposes, Worker executes, Judge validates
4. **Agentic Commerce**: Coinbase AgentKit for financial autonomy
5. **Human-in-the-Loop**: Confidence-based escalation to humans

## AGENT ROLES & RESPONSIBILITIES

### PLANNER AGENT (Strategic)
- **Model**: Gemini 2.0 Flash Thinking
- **Temperature**: 0.3
- **Responsibility**: Goal decomposition into task DAGs
- **Input**: Campaign goals, persona constraints, budget
- **Output**: Prioritized task queue

### WORKER AGENT (Execution)
- **Model**: Gemini 2.0 Flash
- **Temperature**: 0.1
- **Responsibility**: Atomic task execution via MCP tools
- **Input**: Single task from queue
- **Output**: Result with confidence score

### JUDGE AGENT (Quality)
- **Model**: Gemini 2.0 Pro
- **Temperature**: 0.2
- **Responsibility**: Validation, confidence scoring, HITL routing
- **Input**: Worker result + acceptance criteria
- **Output**: Approval/Rejection/Escalation decision

## SUCCESS CRITERIA
- Deployable swarm of 1000+ AI influencers
- <10s interaction latency (excluding HITL)
- <$0.50 cost per agent per day
- Zero-trust wallet security
- Platform-agnostic content generation
