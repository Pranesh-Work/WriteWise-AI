"""
Unit tests for ApplicationController.

Demonstrates how to test the controller using dependency injection
and mocking to isolate component behavior.

To run tests:
    pytest tests/test_controller.py -v
"""

import logging
from unittest.mock import Mock, MagicMock, patch, call
import pytest

from PySide6.QtWidgets import QApplication

from app.startup import ApplicationController, initialize_application
from app.config import ApplicationConfig, WindowConfig
from app.logger import ApplicationLogger
from app.events import ApplicationEvent, EventBus


class TestApplicationControllerInitialization:
    """Test ApplicationController initialization."""

    def test_initialization_with_defaults(self):
        """Test controller initialization with default parameters."""
        mock_app = Mock(spec=QApplication)

        controller = ApplicationController(mock_app)

        assert controller.app is mock_app
        assert controller.config is not None
        assert isinstance(controller.config, ApplicationConfig)
        assert controller.event_bus is not None
        assert isinstance(controller.event_bus, EventBus)
        assert controller.main_window is None
        assert controller.settings_window is None
        assert controller.tray_icon is None
        assert not controller.is_running()

    def test_initialization_with_custom_dependencies(self):
        """Test controller initialization with custom dependencies."""
        mock_app = Mock(spec=QApplication)
        mock_config = Mock(spec=ApplicationConfig)
        mock_logger = Mock(spec=ApplicationLogger)
        mock_event_bus = Mock(spec=EventBus)

        controller = ApplicationController(
            mock_app,
            config=mock_config,
            logger=mock_logger,
            event_bus=mock_event_bus,
        )

        assert controller.app is mock_app
        assert controller.config is mock_config
        assert controller.event_bus is mock_event_bus

    def test_initialization_with_invalid_app(self):
        """Test that initialization fails with invalid app."""
        with pytest.raises(ValueError):
            ApplicationController(None)

        with pytest.raises(ValueError):
            ApplicationController("not an app")


class TestApplicationControllerStartup:
    """Test ApplicationController startup sequence."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_app = Mock(spec=QApplication)
        self.mock_config = Mock(spec=ApplicationConfig)
        self.mock_event_bus = Mock(spec=EventBus)

        # Patch ApplicationLogger to avoid actual logging
        self.logger_patcher = patch("app.startup.ApplicationLogger.get_logger")
        self.mock_get_logger = self.logger_patcher.start()
        self.mock_logger = Mock()
        self.mock_get_logger.return_value = self.mock_logger

    def teardown_method(self):
        """Clean up test fixtures."""
        self.logger_patcher.stop()

    def test_startup_publishes_events(self):
        """Test that startup publishes correct events."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        # Patch component initialization
        with patch.object(controller, "_initialize_components"):
            with patch.object(controller, "_apply_configuration"):
                with patch.object(self.mock_config, "enable_start_minimized", False):
                    with patch.object(controller.main_window or Mock(), "show"):
                        try:
                            controller.start()
                        except AttributeError:
                            # Expected due to mocking
                            pass

        # Verify STARTING event was published
        assert any(
            call[0][0] == ApplicationEvent.STARTING
            for call in self.mock_event_bus.publish.call_args_list
        )

    def test_startup_initializes_components(self):
        """Test that startup initializes UI components."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        # Patch component initialization to track calls
        with patch.object(controller, "_initialize_components") as mock_init:
            with patch.object(controller, "_apply_configuration"):
                try:
                    controller.start()
                except AttributeError:
                    pass

        mock_init.assert_called_once()

    def test_startup_prevents_multiple_calls(self):
        """Test that start() prevents multiple concurrent calls."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        # Mark as already running
        controller._is_running = True

        # Try to start again
        controller.start()

        # Should log warning but not raise
        assert controller.is_running()

    def test_startup_fails_if_shutting_down(self):
        """Test that start() fails if shutdown is in progress."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        controller._is_shutting_down = True

        with pytest.raises(RuntimeError, match="shutting down"):
            controller.start()


class TestApplicationControllerShutdown:
    """Test ApplicationController shutdown sequence."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_app = Mock(spec=QApplication)
        self.mock_config = Mock(spec=ApplicationConfig)
        self.mock_event_bus = Mock(spec=EventBus)

        # Patch ApplicationLogger
        self.logger_patcher = patch("app.startup.ApplicationLogger.get_logger")
        self.mock_get_logger = self.logger_patcher.start()
        self.mock_logger = Mock()
        self.mock_get_logger.return_value = self.mock_logger

    def teardown_method(self):
        """Clean up test fixtures."""
        self.logger_patcher.stop()

    def test_shutdown_publishes_events(self):
        """Test that shutdown publishes correct events."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        with patch.object(controller, "_cleanup_components"):
            controller.shutdown()

        # Verify events
        assert any(
            call[0][0] == ApplicationEvent.SHUTTING_DOWN
            for call in self.mock_event_bus.publish.call_args_list
        )

    def test_shutdown_is_idempotent(self):
        """Test that shutdown can be called multiple times safely."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        with patch.object(controller, "_cleanup_components"):
            # Call shutdown twice
            controller.shutdown()
            self.mock_event_bus.reset_mock()
            controller.shutdown()

        # Second call should not publish events
        self.mock_event_bus.publish.assert_not_called()

    def test_shutdown_handles_cleanup_errors(self):
        """Test that shutdown handles errors during cleanup."""
        controller = ApplicationController(
            self.mock_app,
            config=self.mock_config,
            event_bus=self.mock_event_bus,
        )

        # Make cleanup raise an error
        with patch.object(controller, "_cleanup_components", side_effect=Exception("Error")):
            # Should not raise
            controller.shutdown()

        # But should publish events
        assert any(
            call[0][0] == ApplicationEvent.SHUTTING_DOWN
            for call in self.mock_event_bus.publish.call_args_list
        )


class TestApplicationControllerMethods:
    """Test ApplicationController public methods."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_app = Mock(spec=QApplication)
        self.mock_config = Mock(spec=ApplicationConfig)

        # Patch ApplicationLogger
        self.logger_patcher = patch("app.startup.ApplicationLogger.get_logger")
        self.mock_get_logger = self.logger_patcher.start()
        self.mock_logger = Mock()
        self.mock_get_logger.return_value = self.mock_logger

    def teardown_method(self):
        """Clean up test fixtures."""
        self.logger_patcher.stop()

    def test_show_settings_shows_window(self):
        """Test show_settings displays the settings window."""
        controller = ApplicationController(self.mock_app)
        mock_settings = Mock()
        controller.settings_window = mock_settings

        controller.show_settings()

        mock_settings.show.assert_called_once()
        mock_settings.raise_.assert_called_once()
        mock_settings.activateWindow.assert_called_once()

    def test_show_settings_handles_none(self):
        """Test show_settings handles when settings window is None."""
        controller = ApplicationController(self.mock_app)
        controller.settings_window = None

        # Should not raise
        controller.show_settings()

    def test_show_main_window_shows_window(self):
        """Test show_main_window displays the main window."""
        controller = ApplicationController(self.mock_app)
        mock_main = Mock()
        controller.main_window = mock_main

        controller.show_main_window()

        mock_main.showNormal.assert_called_once()
        mock_main.activateWindow.assert_called_once()

    def test_is_running_reflects_state(self):
        """Test is_running returns current state."""
        controller = ApplicationController(self.mock_app)

        assert not controller.is_running()

        controller._is_running = True
        assert controller.is_running()


class TestConfigurationDataclass:
    """Test ApplicationConfig dataclass."""

    def test_default_configuration(self):
        """Test default configuration values."""
        config = ApplicationConfig()

        assert config.app_name == "WriteWise AI"
        assert config.version == "1.0.0"
        assert config.enable_tray_icon is True
        assert config.enable_start_minimized is False
        assert config.debug_mode is False

    def test_custom_configuration(self):
        """Test custom configuration values."""
        window_config = WindowConfig(width=1024, height=768)
        config = ApplicationConfig(
            app_name="Test App",
            window=window_config,
            debug_mode=True,
        )

        assert config.app_name == "Test App"
        assert config.window.width == 1024
        assert config.window.height == 768
        assert config.debug_mode is True

    def test_configuration_to_dict(self):
        """Test configuration export to dictionary."""
        config = ApplicationConfig()
        config_dict = config.to_dict()

        assert isinstance(config_dict, dict)
        assert config_dict["app_name"] == "WriteWise AI"
        assert "window" in config_dict
        assert isinstance(config_dict["window"], dict)

    def test_configuration_from_dict(self):
        """Test configuration creation from dictionary."""
        config_dict = {
            "app_name": "My App",
            "version": "2.0.0",
            "window": {"width": 1024, "height": 768},
        }
        config = ApplicationConfig.from_dict(config_dict)

        assert config.app_name == "My App"
        assert config.version == "2.0.0"
        assert config.window.width == 1024
        assert config.window.height == 768


class TestEventBus:
    """Test EventBus pub/sub system."""

    def test_subscribe_and_publish(self):
        """Test subscribing and publishing events."""
        event_bus = EventBus()
        callback = Mock()

        event_bus.subscribe(ApplicationEvent.STARTED, callback)
        event_bus.publish(ApplicationEvent.STARTED, data="test")

        callback.assert_called_once_with("test")

    def test_unsubscribe(self):
        """Test unsubscribing from events."""
        event_bus = EventBus()
        callback = Mock()

        event_bus.subscribe(ApplicationEvent.STARTED, callback)
        event_bus.unsubscribe(ApplicationEvent.STARTED, callback)
        event_bus.publish(ApplicationEvent.STARTED)

        callback.assert_not_called()

    def test_multiple_subscribers(self):
        """Test multiple subscribers to same event."""
        event_bus = EventBus()
        callback1 = Mock()
        callback2 = Mock()

        event_bus.subscribe(ApplicationEvent.STARTED, callback1)
        event_bus.subscribe(ApplicationEvent.STARTED, callback2)
        event_bus.publish(ApplicationEvent.STARTED)

        callback1.assert_called_once()
        callback2.assert_called_once()

    def test_subscriber_exception_handling(self):
        """Test that exceptions in subscribers don't break event publishing."""
        event_bus = EventBus()
        callback1 = Mock(side_effect=Exception("Error"))
        callback2 = Mock()

        event_bus.subscribe(ApplicationEvent.STARTED, callback1)
        event_bus.subscribe(ApplicationEvent.STARTED, callback2)

        # Should not raise despite callback1 raising
        event_bus.publish(ApplicationEvent.STARTED)

        callback2.assert_called_once()


# =============================================================================
# INTEGRATION TESTS
# =============================================================================
#
# These tests demonstrate integration between multiple components.
# Note: Full integration tests should use pytest fixtures and real Qt widgets.


class TestApplicationControllerIntegration:
    """Integration tests for ApplicationController."""

    @patch("app.startup.MainWindow")
    @patch("app.startup.SettingsWindow")
    @patch("app.startup.TrayIcon")
    @patch("app.startup.ApplicationLogger.get_logger")
    def test_full_lifecycle(self, mock_get_logger, mock_tray, mock_settings, mock_main):
        """Test complete application lifecycle (start and shutdown)."""
        # Setup logger
        mock_logger = Mock()
        mock_get_logger.return_value = mock_logger

        # Setup UI components
        mock_main.return_value = Mock()
        mock_settings.return_value = Mock()
        mock_tray.return_value = Mock()

        mock_app = Mock(spec=QApplication)
        mock_config = ApplicationConfig()
        mock_event_bus = EventBus()

        controller = ApplicationController(
            mock_app,
            config=mock_config,
            event_bus=mock_event_bus,
        )

        # Collect events
        events = []
        mock_event_bus.subscribe(
            ApplicationEvent.STARTING,
            lambda _: events.append(ApplicationEvent.STARTING),
        )
        mock_event_bus.subscribe(
            ApplicationEvent.STARTED,
            lambda _: events.append(ApplicationEvent.STARTED),
        )

        # Start
        controller.start()
        assert controller.is_running()
        assert ApplicationEvent.STARTING in events
        assert ApplicationEvent.STARTED in events

        # Shutdown
        events.clear()
        mock_event_bus.subscribe(
            ApplicationEvent.SHUTTING_DOWN,
            lambda _: events.append(ApplicationEvent.SHUTTING_DOWN),
        )
        mock_event_bus.subscribe(
            ApplicationEvent.SHUTDOWN_COMPLETE,
            lambda _: events.append(ApplicationEvent.SHUTDOWN_COMPLETE),
        )

        controller.shutdown()
        assert not controller.is_running()
        assert ApplicationEvent.SHUTTING_DOWN in events
        assert ApplicationEvent.SHUTDOWN_COMPLETE in events
