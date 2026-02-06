import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://admin:password@localhost:5432/chimera'
});

export const initSchema = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_relationship_state (
      user_id TEXT PRIMARY KEY,
      handle TEXT NOT NULL,
      interaction_count INTEGER DEFAULT 0,
      sentiment_score FLOAT DEFAULT 0.0,
      last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    );
  `;
  try {
    await pool.query(query);
    console.log('[MCP-LOG] UserRelationshipState schema initialized.');
  } catch (err) {
    console.error('[MCP-LOG] Failed to initialize PostgreSQL schema:', err);
  }
};

export default pool;
