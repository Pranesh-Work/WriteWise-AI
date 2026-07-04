import sys

from PySide6.QtWidgets import QApplication, QLabel


def main():
    app = QApplication(sys.argv)

    label = QLabel("Welcome to WriteWise AI")
    label.resize(350, 120)
    label.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()