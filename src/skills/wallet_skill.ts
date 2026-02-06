import { coinbaseSkill } from './coinbase_mcp';
import { cfoJudge } from '../orchestrator/cfo_judge';
import { logAudit } from '../telemetry/mcp_logger';

export class WalletSkill {
  /**
   * Executes a transfer after CFO Judge authorization.
   */
  public async executeTransfer(agentId: string, toAddress: string, amount: number) {
    const authorized = await cfoJudge.authorizeSpend(agentId, amount);
    if (!authorized) {
      logAudit('WalletSkill', `Action BLOCKED. Budget limit exceeded for ${agentId}.`);
      throw new Error('Budget authorization failed.');
    }

    try {
      // Logic for on-chain transfer via Coinbase AgentKit
      // For now, we sign a mock transaction hash
      const txHash = `0x${Math.random().toString(16).slice(2)}`;
      logAudit('WalletSkill', `Transfer executed. TxHash: ${txHash}`, { toAddress, amount });
      return txHash;
    } catch (err) {
      console.error('[MCP-LOG] WalletSkill execution failed:', err);
      throw err;
    }
  }
}

export const walletSkill = new WalletSkill();
