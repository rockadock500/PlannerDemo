from app.core.config_loader import ConfigEngine
from typing import Optional, Dict, Any

def get_agent_config(agent_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves the loaded JSON config for a specific agent.
    """
    return ConfigEngine.get_config(agent_id)
