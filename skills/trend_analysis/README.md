# Skill: Trend Analysis

Analyzes social signals and market data to identify viral trends and engagement opportunities for a specific niche.

## API Contract

### Input Schema
```typescript
interface TrendAnalysisInput {
  location: string;    // e.g., 'us-east'
  niche: string;       // e.g., 'ai-tech', 'crypto'
  timeframe: string;   // e.g., '24h', '7d'
  limit?: number;      // max number of trends to return
}
```

### Output Schema
```typescript
interface TrendAnalysisOutput {
  success: boolean;
  trends: Array<{
    topic: string;
    reach: number;     // 0-100 score
    sentiment: number; // -1 to +1
    summary: string;
  }>;
  timestamp: string;
  error?: string;
}
```

## MCP Dependencies
- `twitter-mcp`: `search_tweets`, `get_trending_topics`
- `news-mcp`: `get_latest_niche_news`
