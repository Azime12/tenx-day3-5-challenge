import { AgentKit, CdpEvmWalletProvider } from '@coinbase/agentkit';
import * as dotenv from 'dotenv';

dotenv.config();

export class CoinbaseSkill {
  private kit?: AgentKit;
  private walletProvider?: CdpEvmWalletProvider;

  /**
   * Initializes the Coinbase AgentKit.
   */
  public async init() {
    try {
      this.walletProvider = await CdpEvmWalletProvider.configureWithWallet({
        apiKeyId: process.env.CDP_API_KEY_NAME!,
        apiKeySecret: process.env.CDP_API_KEY_PRIVATE_KEY!,
        networkId: 'base-mainnet',
      });

      this.kit = await AgentKit.from({
        walletProvider: this.walletProvider,
      });

      console.log('[MCP-LOG] Coinbase AgentKit initialized on Base.');
    } catch (err) {
      console.error('[MCP-LOG] Failed to initialize Coinbase AgentKit:', err);
    }
  }

  /**
   * Gets the wallet address.
   */
  public async getAddress(): Promise<string | undefined> {
    return this.walletProvider?.getAddress();
  }

  /**
   * Signs a message for on-chain verification.
   */
  public async signMessage(message: string): Promise<string | undefined> {
    return await this.walletProvider?.signMessage(message);
  }
}

export const coinbaseSkill = new CoinbaseSkill();
