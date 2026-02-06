# Trend Analysis Skill

---
name: trend_analysis
description: Analyzes social signals and market data to identify viral trends and engagement opportunities.
---

## Capabilities
- Fetch trending topics from social platforms via MCP using `news://{location}/{niche}/latest`.
- Synthesize reach and sentiment for identified topics.
- Rank trends based on influencer persona relevance.

## API Specification

### Input Schema
```json
{
  "location": "string",
  "niche": "string",
  "timeframe": "string"
}
```

### Output Schema
```json
{
  "trends": [
    {
      "topic": "string",
      "volume": "number",
      "sentiment": "number"
    }
  ],
  "timestamp": "string"
}
```

## Usage Patterns
```typescript
// Example usage in Worker
import { analyzeTrends } from 'skills/trend_analysis';
const signals = await analyzeTrends({ 
  location: 'us-east', 
  niche: 'ai-tech', 
  timeframe: '24h' 
});
```
