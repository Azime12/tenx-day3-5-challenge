# Skill: Content Generation

Generates persona-aligned, multimodal content based on identified trends and specific influencer goals.

## API Contract

### Input Schema
```typescript
interface ContentGenerationInput {
  trend: string;       // The topic to write about
  personaId: string;   // ID of the target influencer persona
  format: 'text' | 'image' | 'thread';
  context?: string;    // Additional memory/rag context
}
```

### Output Schema
```typescript
interface ContentGenerationOutput {
  success: boolean;
  content: {
    body: string;      // The actual post text
    mediaUrl?: string; // Generated image URL if applicable
    disclosure: string; // Mandatory [AI Generated] string
  };
  confidence: number;  // LLM self-assessment
  error?: string;
}
```

## MCP Dependencies
- `gemini-mcp`: `generate_content`, `embed_text`
- `dalle-mcp`: `generate_image` (if applicable)
