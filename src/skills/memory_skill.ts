import client from '../common/weaviate';

export class MemorySkill {
  /**
   * Retrieves relevant persona context based on keywords.
   */
  public async getRelevantContext(query: string) {
    try {
      const result = await client.graphql
        .get()
        .withClassName('PersonaContext')
        .withFields('content source userId')
        .withNearText({ concepts: [query] })
        .withLimit(3)
        .do();

      return result.data.Get.PersonaContext;
    } catch (err) {
      console.error('[MCP-LOG] MemorySkill retrieval failed:', err);
      return [];
    }
  }

  /**
   * Stores a new interaction or persona fact.
   */
  public async storeFact(content: string, source: string, userId: string) {
    try {
      await client.data
        .creator()
        .withClassName('PersonaContext')
        .withProperties({
          content,
          source,
          userId
        })
        .do();
    } catch (err) {
      console.error('[MCP-LOG] MemorySkill storage failed:', err);
    }
  }
}

export const memorySkill = new MemorySkill();
