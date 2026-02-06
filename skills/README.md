# Project Chimera - Agent Skills

This directory contains the runtime capability packages ("Skills") used by the Project Chimera agents.

## What is a Skill?
A **Skill** is a specific, modular package that extends an agent's capability beyond its base LLM reasoning. Each skill is designed to handle a discrete domain of tasks, such as trend synthesis or blockchain interactions.

## Architecture
Skills follow a standardized interface to ensure interoperability across the swarm.

- **Input**: Strictly typed JSON object.
- **Output**: Standardized result object with success status and data.
- **Logic**: Typically abstracts one or more MCP tool calls.

## Skill Registry
| Name | Description | Status |
| :--- | :--- | :--- |
| `trend_analysis` | Analyzes social signals for viral trends. | Defined |
| `content_generation` | Generates persona-aligned social content. | Defined |
| `social_publishing` | Distributes content across platforms. | Defined |

## Implementation Ledger
Every skill folder MUST contain:
1. `README.md`: Documentation and API Contract.
2. `SKILL.md`: Metadata for the Antigravity framework.
3. `index.ts`: Primary entry point for skill execution.
