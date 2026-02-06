# Project Chimera - Agent Orchestration Rules

## CONTEXT
This is Project Chimera 2026 Edition - Autonomous Influencer Network.
We're building with the **Antigravity** AI agent framework.
Target: Deployable swarm of 1000+ AI influencers.

## PRIME DIRECTIVES
1. **ALWAYS** check `specs/` and `.specify/memory/specs/` before implementing.
2. Use **TypeScript/Node.js** exclusively (No Python).
3. Implement **FastRender Swarm**: Strictly follow the Planner/Worker/Judge pattern.
4. **ALL** external interactions MUST be abstracted via **MCP** (Model Context Protocol).
5. Financial autonomy is managed via **Coinbase AgentKit**.

## AGENT ROLES
- **Planner Agent**: Responsible for goal decomposition and task creation.
- **Worker Agent**: Executes specific tasks using MCP-enabled tools.
- **Judge Agent**: Performs quality control, constraint validation, and HITL routing.
- **CFO Agent**: Governs budgets and authorizes economic transactions.

## SKILLS INTERFACE
All skills within the `skills/` directory must implement the following interface:

```typescript
export interface SkillInput {
  [key: string]: any;
}

export interface SkillOutput {
  success: boolean;
  data?: any;
  error?: string;
  confidence?: number;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface Skill {
  /**
   * Executes the core logic of the skill.
   */
  execute(input: SkillInput): Promise<SkillOutput>;

  /**
   * Optional: Validates input before execution.
   */
  validate?(input: SkillInput): ValidationResult;
}
```
