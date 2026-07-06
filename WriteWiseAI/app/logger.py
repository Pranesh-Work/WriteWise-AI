"""
Logger management for WriteWise AI application.

Handles logger configuration, creation, and management.
"""

import logging
import logging.handlers
from pathlib import Path
from typing import Optional


class LoggerManager:
    """
    Manages application logging configuration and setup.

    Responsibilities:
    - Create and configure logger
    - Handle file and console output
    - Manage log rotation
    - Provide logger access

    Attributes:
        logger: The root logger instance for the application
        log_dir: Directory where log files are stored
    """

    _instance: Optional["LoggerManager"] = None
    _logger: Optional[logging.Logger] = None

    def __new__(cls) -> "LoggerManager":
        """Ensure singleton pattern."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(
        self,
        log_level: int = logging.INFO,
        log_dir: Optional[Path] = None,
        enable_file: bool = True,
        enable_console: bool = True,
    ) -> None:
        """
        Initialize LoggerManager.

        Args:
            log_level: Logging level (default: logging.INFO)
            log_dir: Directory for log files (default: './logs')
            enable_file: Enable file logging
            enable_console: Enable console logging
        """
        if LoggerManager._logger is not None:
            return  # Already configured

        log_dir = log_dir or Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)

        self._logger = logging.getLogger("WriteWiseAI")
        self._logger.setLevel(log_level)
        self.log_dir = log_dir

        # Create formatter
        formatter = logging.Formatter(
            fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        # Clear existing handlers
        self._logger.handlers.clear()

        # Add console handler
        if enable_console:
            console_handler = logging.StreamHandler()
            console_handler.setLevel(log_level)
            console_handler.setFormatter(formatter)
            self._logger.addHandler(console_handler)

        # Add file handler with rotation
        if enable_file:
            log_file = log_dir / "writewise_ai.log"
            file_handler = logging.handlers.RotatingFileHandler(
                log_file,
                maxBytes=10 * 1024 * 1024,  # 10 MB
                backupCount=5,
            )
            file_handler.setLevel(log_level)
            file_handler.setFormatter(formatter)
            self._logger.addHandler(file_handler)

        LoggerManager._logger = self._logger

    @classmethod
    def get_logger(cls) -> logging.Logger:
        """
        Get the configured logger instance.

        Returns:
            Logger instance for the application.

        Raises:
            RuntimeError: If logger not initialized.
        """
        if cls._logger is None:
            raise RuntimeError("LoggerManager not initialized. Call LoggerManager() first.")
        return cls._logger

    @classmethod
    def reset(cls) -> None:
        """Reset logger to initial state (for testing)."""
        if cls._logger is not None:
            for handler in cls._logger.handlers[:]:
                cls._logger.removeHandler(handler)
                handler.close()
        cls._logger = None
        cls._instance = None
