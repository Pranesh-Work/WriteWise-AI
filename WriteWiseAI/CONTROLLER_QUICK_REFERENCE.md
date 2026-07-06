"""
Quick Reference Guide for ApplicationController.

Fast lookup guide for common tasks and patterns.
"""

# =============================================================================
# QUICK START
# =============================================================================

# In main.py:
from app.startup import initialize_application
import sys

def main():
    controller = initialize_application()
    controller.start()
    sys.exit(controller.app.exec())


# =============================================================================
# CUSTOMIZING CONFIGURATION
# =============================================================================

from app.config import ApplicationConfig, WindowConfig

config = ApplicationConfig(
    app_name="My App",
    version="1.0.0",
    enable_start_minimized=False,
    enable_tray_icon=True,
    debug_mode=True,
    window=WindowConfig(
        title="My App",
        width=1024,
        height=768,
        min_width=600,
        min_height=400,
    )
)


# =============================================================================
# SUBSCRIBING TO APPLICATION EVENTS
# =============================================================================

from app.events import ApplicationEvent

controller = initialize_application()

def on_app_started(data):
    print("Application started!")

def on_app_shutting_down(data):
    print("Application shutting down!")

controller.event_bus.subscribe(ApplicationEvent.STARTED, on_app_started)
controller.event_bus.subscribe(ApplicationEvent.SHUTTING_DOWN, on_app_shutting_down)

controller.start()


# =============================================================================
# LOGGING OPERATIONS
# =============================================================================

from app.logger import ApplicationLogger
import logging

logger = ApplicationLogger.get_logger()

logger.info("This is an info message")
logger.warning("This is a warning")
logger.error("This is an error")
logger.debug("Debug message (when debug_mode=True)")

# Logging is configured to output to:
#   - Console (with formatting)
#   - ./logs/writewise_ai.log (with rotation every 10MB)


# =============================================================================
# GETTING CONTROLLER COMPONENTS
# =============================================================================

controller = initialize_application()
controller.start()

# Access initialized components
main_window = controller.main_window
settings_window = controller.settings_window
tray_icon = controller.tray_icon

# Check if running
if controller.is_running():
    print("App is running")

# Show windows programmatically
controller.show_main_window()
controller.show_settings()

# Shutdown
controller.shutdown()


# =============================================================================
# DEPENDENCY INJECTION FOR TESTING
# =============================================================================

from unittest.mock import Mock
from app.startup import ApplicationController
from app.config import ApplicationConfig
from app.events import EventBus

def test_my_app():
    # Create mocks
    mock_app = Mock()
    mock_config = Mock()
    mock_event_bus = Mock()
    
    # Inject dependencies
    controller = ApplicationController(
        mock_app,
        config=mock_config,
        event_bus=mock_event_bus,
    )
    
    # Test controller behavior
    assert controller.app is mock_app
    assert controller.config is mock_config


# =============================================================================
# COMMON PATTERNS
# =============================================================================

# PATTERN 1: Run code after application starts
from app.events import ApplicationEvent

controller = initialize_application()

def initialize_services(data):
    print("Services initialized here")

controller.event_bus.subscribe(ApplicationEvent.STARTED, initialize_services)
controller.start()


# PATTERN 2: Run cleanup code before shutdown
def cleanup_services(data):
    print("Cleanup here")

controller.event_bus.subscribe(ApplicationEvent.SHUTTING_DOWN, cleanup_services)


# PATTERN 3: Handle UI component signals (already done in controller)
# Signals are automatically connected:
#   - tray_icon.show_requested -> controller.show_main_window()
#   - tray_icon.settings_requested -> controller.show_settings()
#   - tray_icon.exit_requested -> controller.shutdown()
#   - settings_window.on_apply -> controller._on_settings_applied()


# PATTERN 4: Configure logger with debug mode
from app.logger import ApplicationLogger
import logging

ApplicationLogger(log_level=logging.DEBUG)


# =============================================================================
# TROUBLESHOOTING CHECKLIST
# =============================================================================

# ✓ Application won't start
#   - Check logs in ./logs/writewise_ai.log
#   - Verify QApplication is created before controller
#   - Use try/except in main.py to catch exceptions

# ✓ Settings window won't show
#   - Verify SettingsWindow is initialized (check logs)
#   - Call controller.show_settings()
#   - Check settings_window is not None

# ✓ Tray icon missing
#   - Check system tray is available
#   - Verify enable_tray_icon=True in config
#   - Check assets/icons/app_icon.png exists

# ✓ Multiple shutdown calls causing errors
#   - shutdown() is idempotent - safe to call multiple times
#   - No changes needed

# ✓ Components not initialized
#   - All components initialized in _initialize_components()
#   - Check logs for specific component failures
#   - Verify __init__ methods don't require args


# =============================================================================
# PUBLIC INTERFACE REFERENCE
# =============================================================================

class ApplicationController:
    """Public methods only. Prefix _ indicates private."""
    
    def __init__(
        self,
        app: QApplication,
        config: Optional[ApplicationConfig] = None,
        logger: Optional[ApplicationLogger] = None,
        event_bus: Optional[EventBus] = None,
    ) -> None:
        """Initialize controller with dependencies."""
        
    def start(self) -> None:
        """Start application and show main window."""
        
    def shutdown(self) -> None:
        """Gracefully shutdown application."""
        
    def show_settings(self) -> None:
        """Display settings window."""
        
    def show_main_window(self) -> None:
        """Show and activate main window."""
        
    def is_running(self) -> bool:
        """Check if application is running."""
        
    # Private methods (don't call directly)
    # _initialize_components()
    # _cleanup_components()
    # _apply_configuration()
    # _on_settings_applied()


# =============================================================================
# ATTRIBUTES REFERENCE
# =============================================================================

class ApplicationController:
    app: QApplication              # The PySide6 application
    config: ApplicationConfig      # Configuration settings
    logger: ApplicationLogger      # Logger instance
    event_bus: EventBus            # Event pub/sub system
    
    main_window: Optional[MainWindow]        # Main app window
    settings_window: Optional[SettingsWindow]  # Settings dialog
    tray_icon: Optional[TrayIcon]            # Tray icon


# =============================================================================
# CONFIGURATION OPTIONS
# =============================================================================

ApplicationConfig(
    app_name: str = "WriteWise AI",
    version: str = "1.0.0",
    window: WindowConfig = ...,
    assets_dir: Path = Path("assets"),
    logs_dir: Path = Path("logs"),
    data_dir: Path = Path("data"),
    enable_tray_icon: bool = True,
    enable_start_minimized: bool = False,
    enable_auto_update: bool = False,
    debug_mode: bool = False,
)

WindowConfig(
    title: str = "WriteWise AI",
    width: int = 800,
    height: int = 600,
    min_width: int = 600,
    min_height: int = 400,
    remember_position: bool = True,
    remember_size: bool = True,
)


# =============================================================================
# EVENTS REFERENCE
# =============================================================================

ApplicationEvent.STARTING           # Published when startup begins
ApplicationEvent.STARTED            # Published when startup completes
ApplicationEvent.SHUTTING_DOWN      # Published when shutdown begins
ApplicationEvent.SHUTDOWN_COMPLETE  # Published when shutdown completes


# =============================================================================
# FILE STRUCTURE
# =============================================================================

# app/
#   startup.py                    # ApplicationController & initialize_application()
#   config.py                     # ApplicationConfig & WindowConfig
#   logger.py                     # ApplicationLogger singleton
#   events.py                     # ApplicationEvent enum & EventBus
#   ARCHITECTURE.md               # Full architecture guide
#
# ui/
#   main_window.py                # MainWindow UI component
#   settings_window.py            # SettingsWindow with signals
#   tray_icon.py                  # TrayIcon with signals
#
# tests/
#   test_controller.py            # Unit & integration tests
#
# main.py                         # Entry point using initialize_application()
# logs/                           # Log files (auto-created)


# =============================================================================
# CHECKLIST FOR EXTENDING
# =============================================================================

# To add a new component:
# 
# 1. [ ] Create component class
# 2. [ ] Add reference in controller:
#        self.my_component: Optional[MyComponent] = None
# 3. [ ] Initialize in _initialize_components():
#        self.my_component = MyComponent()
# 4. [ ] Connect signals if applicable:
#        self.my_component.signal.connect(self.handler)
# 5. [ ] Cleanup in _cleanup_components():
#        if self.my_component is not None:
#            self.my_component.cleanup()
# 6. [ ] Add unit tests
# 7. [ ] Update ARCHITECTURE.md
# 8. [ ] Test full startup/shutdown cycle


if __name__ == "__main__":
    print(__doc__)
