# Social Publishing Skill

---
name: social_publishing
description: Manages cross-platform distribution and scheduling of generated content.
---

## Capabilities
- Publish to Twitter, LinkedIn, Instagram via platform-specific MCPs.
- Schedule posts for optimal engagement times.
- Track publication status and transaction hashes.

## Usage Patterns
```typescript
// Example usage in Worker
import { publishToSocials } from 'skills/social_publishing';
const result = await publishToSocials({ content: '...', platforms: ['twitter'] });
```
