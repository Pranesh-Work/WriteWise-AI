"""
WriteWise AI - Main entry point.

Creates the application, initializes the controller, and starts the event loop.
"""

import sys

from PySide6.QtWidgets import QApplication

from app.controller import ApplicationController


def main() -> None:
    """Main application entry point."""
    app = QApplication(sys.argv)
    controller = ApplicationController(app)
    controller.start()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()