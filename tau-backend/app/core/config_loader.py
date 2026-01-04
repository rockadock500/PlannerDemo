import os
import json
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConfigEngine:
    _configs: Dict[str, Any] = {}

    @classmethod
    def load(cls, config_dir: str = "configs") -> None:
        """
        Loads all JSON files from the configs directory into a global dictionary.
        Refuses to start if a JSON file has a syntax error.
        """
        # Determine the absolute path for the config directory
        # If config_dir is absolute, use it. Otherwise, assume it's relative to the CWD.
        if os.path.isabs(config_dir):
            config_path = config_dir
        else:
            config_path = os.path.abspath(os.path.join(os.getcwd(), config_dir))
             
        if not os.path.exists(config_path):
            error_msg = f"Config directory not found: {config_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        logger.info(f"Loading configs from: {config_path}")
        
        cls._configs = {}

        for root, _, files in os.walk(config_path):
            for file in files:
                if file.endswith(".json"):
                    full_path = os.path.join(root, file)
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            # Use the filename (without extension) as the key
                            key = os.path.splitext(file)[0]
                            cls._configs[key] = data
                            logger.info(f"Loaded config: {key}")
                    except json.JSONDecodeError as e:
                        logger.critical(f"FATAL: Syntax error in config file '{full_path}': {e}")
                        raise e 
                    except Exception as e:
                        logger.critical(f"FATAL: Error reading config file '{full_path}': {e}")
                        raise e

    @classmethod
    def get_config(cls, config_name: str) -> Dict[str, Any]:
        return cls._configs.get(config_name)

    @classmethod
    def get_all_config_names(cls) -> list[str]:
        return list(cls._configs.keys())
