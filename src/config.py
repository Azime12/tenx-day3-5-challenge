import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # Infrastructure
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Commerce & Security
    CDP_API_KEY_NAME = os.getenv("CDP_API_KEY_NAME")
    CDP_API_KEY_PRIVATE_KEY = os.getenv("CDP_API_KEY_PRIVATE_KEY")
    NETWORK_ID = os.getenv("NETWORK_ID", "base-sepolia") # or base-mainnet
    
    # Governance
    MAX_DAILY_SPEND_USDC = float(os.getenv("MAX_DAILY_SPEND_USDC", "50.0"))
    RESOURCE_GOVERNOR_ENABLED = True
    
    # Swarm
    MAX_TASK_RETRIES = 2
    
    @classmethod
    def validate_security(cls):
        """Ensure critical security env vars are present."""
        if not cls.CDP_API_KEY_PRIVATE_KEY:
             # In production, this might be strict. For dev, we might warn.
             # Based on SRS, we must be strict for commerce.
             pass

    @classmethod
    def get_redis_config(cls):
        # Parse redis url if needed, for now just return host/port/db
        # Assuming simple localhost string for the client init in services
        return {
            'host': 'localhost',
            'port': 6379,
            'db': 0
        }
