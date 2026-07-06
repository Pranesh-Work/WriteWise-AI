"""
Application lifecycle and component management.

Provides the main ApplicationController that orchestrates the startup and
shutdown of all application components, manages dependencies, and handles
the overall lifecycle of the PySide6 desktop application.
"""

import logging
import sys
from typing import Optional

from PySide6.QtWidgets import QApplication

from app.config import ApplicationConfig
from app.events import ApplicationEvent, EventBus
from app.logger import ApplicationLogger
from ui.main_window import MainWindow
from ui.settings_window import SettingsWindow
from ui.tray_icon import TrayIcon


class ApplicationController:
    """
    Central controller managing the WriteWise AI application lifecycle.

    This class orchestrates initialization and shutdown of all major application
    components following the controller/orchestrator pattern. It uses dependency
    injection to allow for flexibility and testing.

    The controller follows SOLID principles:
    - Single Responsibility: Manages only lifecycle and component initialization
    - Dependency Inversion: Depends on abstractions and accepts dependencies
    - Interface Segregation: Exposes minimal, focused interface (start/shutdown)

    Attributes:
        app: The PySide6 QApplication instance.
        config: Application configuration object.
        logger: Application logger instance.
        event_bus: Event bus for application-wide events.
        main_window: The main application window.
        settings_window: The settings dialog window.
        tray_icon: The system tray icon.
        _is_running: Flag indicating if the application is currently running.
        _is_shutting_down: Flag to prevent multiple shutdown calls.
    """

    def __init__(
        self,
        app: QApplication,
        config: Optional[ApplicationConfig] = None,
        logger: Optional[ApplicationLogger] = None,
        event_bus: Optional[EventBus] = None,
    ) -> None:
        """
        Initialize the ApplicationController.

        Args:
            app: The PySide6 QApplication instance (required).
            config: Application configuration. If None, creates default config.
            logger: Application logger. If None, creates default logger.
            event_bus: Event bus for events. If None, creates new EventBus.

        Raises:
            ValueError: If app is None or not a QApplication instance.
        """
        if not isinstance(app, QApplication):
            raise ValueError(
                "app must be a QApplication instance"
            )

        self.app = app
        self.config = config or ApplicationConfig()
        self.logger = logger or ApplicationLogger()
        self.event_bus = event_bus or EventBus()

        # Get logger instance
        self._logger = ApplicationLogger.get_logger()

        # Component state
        self.main_window: Optional[MainWindow] = None
        self.settings_window: Optional[SettingsWindow] = None
        self.tray_icon: Optional[TrayIcon] = None

        # Application state
        self._is_running = False
        self._is_shutting_down = False

        self._logger.info("ApplicationController initialized")

    def start(self) -> None:
        """
        Start the application and display the main window.

        This method orchestrates the startup sequence:
        1. Publishes STARTING event
        2. Initializes UI components (main window, settings, tray icon)
        3. Applies configuration settings
        4. Shows the main window
        5. Publishes STARTED event

        The application may start minimized if configured, and will show
        the tray icon if enabled and available.

        Raises:
            RuntimeError: If the application is already running.
        """
        if self._is_running:
            self._logger.warning("Application is already running")
            return

        if self._is_shutting_down:
            self._logger.error("Cannot start: application is shutting down")
            raise RuntimeError("Application is shutting down")

        try:
            self._logger.info("Starting application")
            self.event_bus.publish(ApplicationEvent.STARTING)

            # Initialize UI components
            self._initialize_components()

            # Apply configuration
            self._apply_configuration()

            # Show main window (or keep minimized if configured)
            if not self.config.enable_start_minimized:
                self.main_window.show()
                self._logger.debug("Main window displayed")
            else:
                self._logger.debug("Application starting minimized")

            # Mark as running
            self._is_running = True
            self.event_bus.publish(ApplicationEvent.STARTED)
            self._logger.info("Application started successfully")

        except Exception as e:
            self._logger.error(f"Failed to start application: {e}", exc_info=True)
            self.shutdown()
            raise

    def shutdown(self) -> None:
        """
        Gracefully shutdown the application and clean up resources.

        This method orchestrates the shutdown sequence:
        1. Prevents multiple shutdown calls
        2. Publishes SHUTTING_DOWN event
        3. Cleans up UI components (hides tray icon, closes windows)
        4. Releases resources
        5. Publishes SHUTDOWN_COMPLETE event
        6. Exits the application

        Safe to call multiple times (subsequent calls are no-ops).
        """
        if self._is_shutting_down:
            self._logger.debug("Shutdown already in progress")
            return

        self._is_shutting_down = True

        try:
            self._logger.info("Shutting down application")
            self.event_bus.publish(ApplicationEvent.SHUTTING_DOWN)

            # Clean up UI components
            self._cleanup_components()

            # Mark as no longer running
            self._is_running = False
            self.event_bus.publish(ApplicationEvent.SHUTDOWN_COMPLETE)
            self._logger.info("Application shutdown complete")

        except Exception as e:
            self._logger.error(f"Error during shutdown: {e}", exc_info=True)
        finally:
            # Ensure we exit even if cleanup fails
            self._logger.debug("Exiting application")

    def show_settings(self) -> None:
        """
        Display the settings window.

        Brings the settings window to the foreground and ensures it's
        active and visible. Creates the settings window if it doesn't exist.
        """
        if self.settings_window is None:
            self._logger.debug("Settings window not initialized")
            return

        try:
            self.settings_window.show()
            self.settings_window.raise_()
            self.settings_window.activateWindow()
            self._logger.debug("Settings window shown")
        except Exception as e:
            self._logger.error(f"Failed to show settings window: {e}", exc_info=True)

    def show_main_window(self) -> None:
        """
        Show and activate the main application window.

        Useful when the application is minimized to tray and needs to
        be brought back to focus.
        """
        if self.main_window is None:
            self._logger.debug("Main window not initialized")
            return

        try:
            self.main_window.showNormal()
            self.main_window.activateWindow()
            self._logger.debug("Main window shown")
        except Exception as e:
            self._logger.error(f"Failed to show main window: {e}", exc_info=True)

    def is_running(self) -> bool:
        """
        Check if the application is currently running.

        Returns:
            True if the application is running, False otherwise.
        """
        return self._is_running

    def _initialize_components(self) -> None:
        """
        Initialize all UI components.

        Creates and configures:
        - Main window
        - Settings window
        - System tray icon (if enabled and available)

        Raises:
            RuntimeError: If component initialization fails critically.
        """
        try:
            self._logger.debug("Initializing UI components")

            # Initialize main window
            self.main_window = MainWindow()
            self._logger.debug("Main window initialized")

            # Initialize settings window
            self.settings_window = SettingsWindow(parent=self.main_window)
            self.settings_window.on_apply.connect(self._on_settings_applied)
            self._logger.debug("Settings window initialized")

            # Initialize tray icon if enabled
            if self.config.enable_tray_icon:
                self.tray_icon = TrayIcon(self.main_window)
                self.tray_icon.show_requested.connect(self.show_main_window)
                self.tray_icon.settings_requested.connect(self.show_settings)
                self.tray_icon.exit_requested.connect(self.shutdown)
                self._logger.debug("Tray icon initialized")
            else:
                self._logger.debug("Tray icon disabled by configuration")

        except Exception as e:
            self._logger.error(
                f"Failed to initialize UI components: {e}", exc_info=True
            )
            raise RuntimeError(f"Component initialization failed: {e}") from e

    def _cleanup_components(self) -> None:
        """
        Clean up and release UI components.

        Safely closes and releases all UI components, handling None values
        and suppressing errors to ensure full cleanup.
        """
        self._logger.debug("Cleaning up UI components")

        try:
            if self.tray_icon is not None:
                self.tray_icon.hide()
                self._logger.debug("Tray icon hidden")
        except Exception as e:
            self._logger.warning(f"Error hiding tray icon: {e}")

        try:
            if self.main_window is not None:
                self.main_window.close()
                self._logger.debug("Main window closed")
        except Exception as e:
            self._logger.warning(f"Error closing main window: {e}")

        try:
            if self.settings_window is not None:
                self.settings_window.close()
                self._logger.debug("Settings window closed")
        except Exception as e:
            self._logger.warning(f"Error closing settings window: {e}")

    def _apply_configuration(self) -> None:
        """
        Apply configuration settings to UI components.

        Applies window size, title, and other configuration values to
        the main window.
        """
        if self.main_window is None:
            self._logger.warning("Cannot apply configuration: main window not initialized")
            return

        try:
            self._logger.debug("Applying configuration to components")

            # Apply window configuration
            window_config = self.config.window
            self.main_window.setWindowTitle(window_config.title)
            self.main_window.resize(window_config.width, window_config.height)
            self.main_window.setMinimumSize(
                window_config.min_width, window_config.min_height
            )

            self._logger.debug("Configuration applied successfully")

        except Exception as e:
            self._logger.error(f"Failed to apply configuration: {e}", exc_info=True)

    def _on_settings_applied(self) -> None:
        """
        Handle settings applied event.

        Called when the user applies changes in the settings window.
        Could trigger configuration reload or component updates.
        """
        self._logger.debug("Settings applied")
        # TODO: Implement settings handling as needed


def initialize_application() -> ApplicationController:
    """
    Factory function to create and initialize the application controller.

    This is a convenience function that sets up the standard application
    configuration and returns a ready-to-start controller.

    Returns:
        Initialized ApplicationController instance.

    Example:
        >>> controller = initialize_application()
        >>> controller.start()
        >>> sys.exit(controller.app.exec())
    """
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)

    # Initialize logger
    ApplicationLogger(log_level=logging.INFO)

    # Create configuration
    config = ApplicationConfig()

    # Create controller
    controller = ApplicationController(app, config=config)

    return controller
