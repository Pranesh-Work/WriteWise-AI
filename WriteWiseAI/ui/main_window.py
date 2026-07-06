"""
Main application window for WriteWise AI.

Displays the primary user interface. Contains only UI code, no business logic.
"""

from typing import TYPE_CHECKING

from PySide6.QtWidgets import QMainWindow, QLabel, QWidget, QVBoxLayout
from PySide6.QtCore import Qt

if TYPE_CHECKING:
    from app.config import ConfigManager


class MainWindow(QMainWindow):
    """
    Main application window.

    Responsibilities:
    - Display the primary application window
    - Manage UI layout and widgets
    - Handle window properties

    Does not perform:
    - AI logic
    - Database operations
    - Configuration management
    - Logging setup
    """

    def __init__(self, config: "ConfigManager") -> None:
        """
        Initialize the main window.

        Args:
            config: ConfigManager instance for window configuration
        """
        super().__init__()

        self.config = config

        # Window properties from config
        title = config.get("window.title", "WriteWise AI")
        width = config.get("window.width", 800)
        height = config.get("window.height", 600)
        min_width = config.get("window.min_width", 600)
        min_height = config.get("window.min_height", 400)

        self.setWindowTitle(title)
        self.resize(width, height)
        self.setMinimumSize(min_width, min_height)

        # Central widget with layout
        central_widget = QWidget()
        layout = QVBoxLayout()

        # Welcome label (placeholder for main content)
        welcome_label = QLabel("Welcome to WriteWise AI!")
        welcome_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(welcome_label)

        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)