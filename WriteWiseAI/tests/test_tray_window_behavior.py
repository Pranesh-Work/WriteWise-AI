import pytest
from unittest.mock import Mock, patch

from PySide6.QtCore import Signal
from PySide6.QtWidgets import QApplication

from app.controller import ApplicationController


@pytest.fixture
def qt_app():
    app = QApplication.instance()
    if app is None:
        app = QApplication([])
    return app


def test_show_requested_restores_and_activates_window(qt_app):
    controller = ApplicationController(qt_app)
    mock_window = Mock()

    class FakeTrayIcon:
        def __init__(self, window):
            self.window = window
            self.show_requested = Signal()
            self.exit_requested = Signal()

        def hide(self):
            return None

    with patch("app.controller.MainWindow", return_value=mock_window), patch(
        "app.controller.TrayIcon", FakeTrayIcon
    ):
        controller.start()

    controller.tray_icon.show_requested.emit()

    mock_window.showNormal.assert_called_once_with()
    mock_window.raise_.assert_called_once_with()
    mock_window.activateWindow.assert_called_once_with()
