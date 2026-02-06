import asyncio
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.services.mcp_client import MCPClient

async def main():
    # Use the config file the user just created
    config_path = os.path.join(os.getcwd(), '.gemini', 'antigravity', 'mcp_config.json')
    client = MCPClient(config_path=config_path)
    
    server_name = "tenxfeedbackanalytics"
    
    try:
        await client.connect(server_name)
        
        print("\n--- Available Tools ---")
        tools = await client.list_tools()
        for tool in tools.tools:
            print(f"- {tool.name}: {tool.description}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())
