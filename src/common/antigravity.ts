import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export interface AgentConfig {
  model: string;
  temperature: number;
  systemPrompt: string;
}

/**
 * Base Agent class for the Antigravity framework.
 */
export abstract class Agent {
  protected name: string;
  protected config: AgentConfig;
  protected client: OpenAI;

  constructor(name: string, config: AgentConfig) {
    this.name = name;
    this.config = config;
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Completes a prompt using the agent's configuration.
   */
  protected async complete(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: this.config.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: this.config.temperature,
    });

    return response.choices[0]?.message?.content || '';
  }
}
