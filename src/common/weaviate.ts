import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();

const client: WeaviateClient = weaviate.client({
  scheme: 'http',
  host: process.env.WEAVIATE_URL?.replace('http://', '') || 'localhost:8080',
});

export default client;

export const initMemoryStore = async () => {
  const schemaConfig = {
    class: 'PersonaContext',
    description: 'Vector representation of influencer persona and memory',
    vectorizer: 'none', // Vectors provided manually via LLM skills
    properties: [
      { name: 'content', dataType: ['text'] },
      { name: 'source', dataType: ['string'] },
      { name: 'userId', dataType: ['string'] },
    ],
  };

  try {
    // Check if class exists
    const schema = await client.schema.getter().do();
    const exists = schema.classes?.some((c) => c.class === 'PersonaContext');

    if (!exists) {
      await client.schema.classCreator().withClass(schemaConfig).do();
      console.log('[MCP-LOG] Weaviate PersonaContext class created.');
    }
  } catch (err) {
    console.error('[MCP-LOG] Failed to initialize Weaviate memory store:', err);
  }
};
