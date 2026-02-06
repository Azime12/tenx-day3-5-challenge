# Content Generation Skill

---
name: content_generation
description: Generates persona-aligned, multimodal content based on identified trends and user goals.
---

## Capabilities
- Generate text and image prompts via LLM MCP.
- Enforce persona consistency using Weaviate RAG context.
- Automatic [AI Generated] disclosure insertion.

## Usage Patterns
```typescript
// Example usage in Worker
import { generateContent } from 'skills/content_generation';
const post = await generateContent({ trend: 'MCP', persona: 'chimera_v1' });
```
