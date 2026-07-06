"""
Settings window implementation.

Provides a UI for managing application settings and configuration.
Emits signals when settings are applied to enable communication with the controller.
"""

from typing import Optional

from PySide6.QtWidgets import (
    QWidget,
    QVBoxLayout,
    QLabel,
    QPushButton,
    QHBoxLayout,
)
from PySide6.QtCore import Signal


class SettingsWindow(QWidget):
    """
    Settings window for the application.

    Provides a UI for managing application configuration and preferences.
    Emits signals when the user applies or cancels changes.

    Signals:
        on_apply: Emitted when the user clicks "Apply".
        on_cancel: Emitted when the user clicks "Cancel".
    """

    on_apply = Signal()
    on_cancel = Signal()

    def __init__(self, parent: Optional[QWidget] = None) -> None:
        """
        Initialize the settings window.

        Args:
            parent: Parent widget (typically the main window).
        """
        super().__init__(parent)
        self.setWindowTitle("Settings")
        self.resize(400, 250)

        self._setup_ui()

    def _setup_ui(self) -> None:
        """Set up the settings window UI."""
        layout = QVBoxLayout(self)

        # Header
        header = QLabel("WriteWise AI Settings")
        layout.addWidget(header)

        # TODO: Add settings controls here

        # Buttons
        button_layout = QHBoxLayout()
        apply_button = QPushButton("Apply")
        cancel_button = QPushButton("Cancel")

        apply_button.clicked.connect(self._on_apply)
        cancel_button.clicked.connect(self._on_cancel)

        button_layout.addStretch()
        button_layout.addWidget(apply_button)
        button_layout.addWidget(cancel_button)

        layout.addStretch()
        layout.addLayout(button_layout)

        self.setLayout(layout)

    def _on_apply(self) -> None:
        """Handle apply button click."""
        self.on_apply.emit()
        self.close()

    def _on_cancel(self) -> None:
        """Handle cancel button click."""
        self.on_cancel.emit()
        self.close()
