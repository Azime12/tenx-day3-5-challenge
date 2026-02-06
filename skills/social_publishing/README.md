# Skill: Social Publishing

Manages the cross-platform distribution and scheduling of generated content.

## API Contract

### Input Schema
```typescript
interface SocialPublishingInput {
  platforms: Array<'twitter' | 'linkedin' | 'farcaster'>;
  payload: {
    text: string;
    mediaUrls?: string[];
  };
  scheduleAt?: string; // ISO timestamp
}
```

### Output Schema
```typescript
interface SocialPublishingOutput {
  success: boolean;
  results: Array<{
    platform: string;
    status: 'published' | 'scheduled' | 'failed';
    id?: string;       // Platform-specific post ID
    txHash?: string;   // If on-chain or audited
  }>;
  error?: string;
}
```

## MCP Dependencies
- `twitter-mcp`: `post_tweet`
- `farcaster-mcp`: `cast_message`
