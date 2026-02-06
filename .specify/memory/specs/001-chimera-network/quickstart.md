# Quickstart: Project Chimera Foundation

## Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PNPM (recommended)
- Redis 7.0+
- Weaviate instance

## Environment Setup
1. Copy `.env.template` to `.env`:
   ```bash
   cp .env.template .env
   ```
2. Fill in mandatory keys:
   - `OPENAI_API_KEY`
   - `CDP_API_KEY_NAME`
   - `CDP_API_KEY_PRIVATE_KEY`
   - `TWITTER_API_V2_TOKEN`

## Spin Up Infrastructure
```bash
docker-compose up -d redis weaviate postgres
```

## Run the Swarm (Local Dev)
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the Orchestrator:
   ```bash
   pnpm dev:orchestrator
   ```
3. Start a Worker:
   ```bash
   pnpm dev:worker --persona=alpha
   ```

## Running Tests (TDD)
```bash
pnpm test --watch
```
All commits must follow constitution logging: `[MCP-LOG] your message`.
