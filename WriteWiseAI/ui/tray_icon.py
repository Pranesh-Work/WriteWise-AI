"""
System tray icon for WriteWise AI.

Displays a system tray icon with context menu. Emits signals for user actions
without directly performing application control.
"""

from pathlib import Path
from typing import Optional

from PySide6.QtWidgets import (
    QSystemTrayIcon,
    QMenu,
    QMainWindow,
)
from PySide6.QtGui import QAction, QIcon
from PySide6.QtCore import Signal, QObject


class TrayIconSignals(QObject):
    """Signals emitted by the tray icon."""

    show_requested = Signal()
    exit_requested = Signal()


class TrayIcon(QSystemTrayIcon):
    """
    System tray icon for the application.

    Responsibilities:
    - Display tray icon with context menu
    - Emit signals for user actions
    - Handle show/hide main window request
    - Emit exit request

    Does NOT:
    - Directly exit the application
    - Manage application state
    - Perform any business logic

    Signals:
        show_requested: User wants to show main window
        exit_requested: User wants to exit application
    """

    def __init__(self, window: QMainWindow) -> None:
        """
        Initialize the tray icon.

        Args:
            window: Reference to the main window (for signal purposes)
        """
        super().__init__(window)

        self.window = window
        self._signals = TrayIconSignals()

        # Expose signals
        self.show_requested = self._signals.show_requested
        self.exit_requested = self._signals.exit_requested

        # Create context menu
        self._setup_menu()

        # Set icon
        self._set_icon()

        # Check system tray availability
        if not QSystemTrayIcon.isSystemTrayAvailable():
            import logging
            logging.warning("System tray is not available")
            return

        self.show()

    def _setup_menu(self) -> None:
        """Create and configure the context menu."""
        menu = QMenu()

        show_action = QAction("Show", self)
        exit_action = QAction("Exit", self)

        show_action.triggered.connect(self._on_show)
        exit_action.triggered.connect(self._on_exit)

        menu.addAction(show_action)
        menu.addSeparator()
        menu.addAction(exit_action)

        self.setContextMenu(menu)

    def _set_icon(self) -> None:
        """Set the application icon for the tray."""
        icon_path = Path("assets/icons/app_icon.png")
        if icon_path.exists():
            icon = QIcon(str(icon_path))
            self.setIcon(icon)

    def _on_show(self) -> None:
        """Handle show window action by emitting signal."""
        self.show_requested.emit()

    def _on_exit(self) -> None:
        """Handle exit action by emitting signal."""
        self.exit_requested.emit()