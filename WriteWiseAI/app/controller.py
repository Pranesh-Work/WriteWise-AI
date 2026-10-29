"""
Application controller for WriteWise AI.

Main orchestrator that manages the application lifecycle and owns all major components.
"""

import logging
from typing import Optional

from PySide6.QtWidgets import QApplication

from app.config import ConfigManager
from app.logger import LoggerManager
from ui.main_window import MainWindow
from ui.tray_icon import TrayIcon


class ApplicationController:
    """
    Main application controller and orchestrator.

    Owns and manages the lifecycle of all major application components:
    - ConfigManager: Configuration and settings management
    - LoggerManager: Logging system
    - MainWindow: Primary user interface
    - TrayIcon: System tray integration

    The controller is responsible for:
    - Application initialization
    - Component lifecycle management
    - Shutdown and cleanup
    - Coordination between components

    This class follows the Single Responsibility Principle: it only manages
    the lifecycle and initialization of components. Business logic belongs
    in separate services.

    Attributes:
        app: The PySide6 QApplication instance
        config: ConfigManager for application settings
        logger: LoggerManager for logging
        main_window: MainWindow UI component
        tray_icon: TrayIcon for system tray
        _is_running: Whether the application is currently running
    """

    def __init__(self, qt_app: QApplication) -> None:
        """
        Initialize the application controller.

        Args:
            qt_app: The QApplication instance (required)

        Raises:
            ValueError: If qt_app is not a QApplication instance
        """
        if not isinstance(qt_app, QApplication):
            raise ValueError("qt_app must be a QApplication instance")

        self.app = qt_app

        # Initialize managers (in order)
        self.config = ConfigManager()
        self.logger = LoggerManager()
        self._logger = logging.getLogger(__name__)

        # Initialize UI components (deferred until start())
        self.main_window: Optional[MainWindow] = None
        self.tray_icon: Optional[TrayIcon] = None

        # State tracking
        self._is_running = False

        self._logger.info("ApplicationController initialized")

    def start(self) -> None:
        """
        Start the application and display the main window.

        Orchestrates the startup sequence:
        1. Initialize UI components
        2. Load saved window state
        3. Show main window
        4. Show tray icon
        5. Mark as running

        Raises:
            RuntimeError: If already running or if startup fails
        """
        if self._is_running:
            self._logger.warning("Application already running")
            return

        try:
            self._logger.info("Starting application")

            # Create UI components
            self._logger.debug("Creating MainWindow")
            self.main_window = MainWindow(self.config)

            self._logger.debug("Creating TrayIcon")
            self.tray_icon = TrayIcon(self.main_window)

            # Connect signals
            if self.tray_icon is not None:
                self.tray_icon.show_requested.connect(self._show_main_window)
                self.tray_icon.exit_requested.connect(self.shutdown)

            # Show main window
            if not self.config.get("features.enable_start_minimized", False):
                self._show_main_window()
                self._logger.debug("Main window displayed")

            self._is_running = True
            self._logger.info("Application started successfully")

        except Exception as e:
            self._logger.error(f"Failed to start application: {e}", exc_info=True)
            raise

    def _show_main_window(self) -> None:
        """Display and activate the main window."""
        if self.main_window is None:
            return

        self.main_window.showNormal()
        self.main_window.raise_()
        self.main_window.activateWindow()

    def shutdown(self) -> None:
        """
        Gracefully shutdown the application.

        Orchestrates the shutdown sequence:
        1. Save current state
        2. Close UI components
        3. Save configuration
        4. Mark as not running

        Safe to call multiple times.
        """
        if not self._is_running:
            self._logger.debug("Application not running")
            return

        try:
            self._logger.info("Shutting down application")

            # Close UI components
            if self.tray_icon is not None:
                try:
                    self.tray_icon.hide()
                    self._logger.debug("TrayIcon hidden")
                except Exception as e:
                    self._logger.warning(f"Error hiding tray icon: {e}")

            if self.main_window is not None:
                try:
                    self.main_window.close()
                    self._logger.debug("MainWindow closed")
                except Exception as e:
                    self._logger.warning(f"Error closing main window: {e}")

            # Save configuration
            self.config.save()

            self._is_running = False
            self._logger.info("Application shutdown complete")

        except Exception as e:
            self._logger.error(f"Error during shutdown: {e}", exc_info=True)
        finally:
            # Ensure Qt application exits
            self.app.quit()

    def is_running(self) -> bool:
        """
        Check if the application is currently running.

        Returns:
            True if running, False otherwise
        """
        return self._is_running
