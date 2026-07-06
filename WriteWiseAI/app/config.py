"""
Configuration management for WriteWise AI application.

Handles reading, writing, and managing application configuration and user settings.
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional


class ConfigManager:
    """
    Manages application configuration and user settings.

    Responsibilities:
    - Read configuration from file
    - Write configuration to file
    - Provide default settings
    - Manage application settings

    Attributes:
        config_dir: Directory where config files are stored
        config_file: Path to main configuration file
        settings: Current configuration dictionary
    """

    def __init__(self, config_dir: Optional[Path] = None) -> None:
        """
        Initialize ConfigManager.

        Args:
            config_dir: Directory for config files. Defaults to './data'.
        """
        self.logger = logging.getLogger(__name__)
        self.config_dir = config_dir or Path("data")
        self.config_dir.mkdir(parents=True, exist_ok=True)

        self.config_file = self.config_dir / "config.json"
        self.settings: Dict[str, Any] = self._load_defaults()

        # Load from file if exists
        if self.config_file.exists():
            self._load_from_file()
        else:
            self.save()

        self.logger.info(f"ConfigManager initialized (config_dir={self.config_dir})")

    def _load_defaults(self) -> Dict[str, Any]:
        """
        Get default application settings.

        Returns:
            Dictionary with default settings.
        """
        return {
            "app_name": "WriteWise AI",
            "version": "1.0.0",
            "theme": "light",
            "language": "en",
            "auto_start": False,
            "typing_delay": 1000,
            "window": {
                "title": "WriteWise AI",
                "width": 800,
                "height": 600,
                "min_width": 600,
                "min_height": 400,
                "x": None,
                "y": None,
            },
            "features": {
                "enable_tray_icon": True,
                "enable_start_minimized": False,
                "enable_auto_update": False,
            },
            "debug": False,
        }

    def _load_from_file(self) -> None:
        """Load configuration from JSON file."""
        try:
            with open(self.config_file, "r") as f:
                file_config = json.load(f)
                self.settings.update(file_config)
            self.logger.info(f"Configuration loaded from {self.config_file}")
        except Exception as e:
            self.logger.error(f"Failed to load config from file: {e}")
            self.logger.info("Using default configuration")

    def save(self) -> bool:
        """
        Save current configuration to file.

        Returns:
            True if save successful, False otherwise.
        """
        try:
            with open(self.config_file, "w") as f:
                json.dump(self.settings, f, indent=2)
            self.logger.info(f"Configuration saved to {self.config_file}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to save config: {e}")
            return False

    def get(self, key: str, default: Any = None) -> Any:
        """
        Get a configuration value.

        Args:
            key: Configuration key (supports nested keys with dots, e.g., "window.width").
            default: Default value if key not found.

        Returns:
            Configuration value or default.
        """
        if "." in key:
            # Handle nested keys
            parts = key.split(".")
            value = self.settings
            for part in parts:
                if isinstance(value, dict):
                    value = value.get(part)
                else:
                    return default
            return value if value is not None else default
        return self.settings.get(key, default)

    def set(self, key: str, value: Any) -> None:
        """
        Set a configuration value.

        Args:
            key: Configuration key (supports nested keys with dots).
            value: Value to set.
        """
        if "." in key:
            # Handle nested keys
            parts = key.split(".")
            current = self.settings
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = value
            self.logger.debug(f"Config updated: {key}={value}")
        else:
            self.settings[key] = value
            self.logger.debug(f"Config updated: {key}={value}")

    def reset_to_defaults(self) -> None:
        """Reset configuration to default values."""
        self.settings = self._load_defaults()
        self.save()
        self.logger.info("Configuration reset to defaults")
