# Frozen Architecture Quick Reference

Use this as a quick lookup for the frozen architecture.

---

## File Structure (Copy-Paste Ready)

```
WriteWiseAI/
├── app/
│   ├── __init__.py           # Package marker
│   ├── controller.py         # ApplicationController ⭐ START HERE
│   ├── config.py             # ConfigManager
│   ├── logger.py             # LoggerManager
│   └── constants.py          # (available for future use)
├── ui/
│   ├── __init__.py           # Package marker
│   ├── main_window.py        # MainWindow
│   ├── tray_icon.py          # TrayIcon
│   └── resources.py          # (available for future use)
├── main.py                   # Entry point (20 lines max) ⭐
├── requirements.txt
└── README.md
```

---

## Code Templates

### main.py Template (Copy-Paste)

```python
"""WriteWise AI - Main entry point."""

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
```

### New UI Component Template

```python
"""UI component for WriteWise AI."""

from typing import TYPE_CHECKING

from PySide6.QtWidgets import QWidget

if TYPE_CHECKING:
    from app.config import ConfigManager


class MyComponent(QWidget):
    """
    My custom UI component.
    
    Responsibilities:
    - Display UI
    - Emit signals for user actions
    
    Does NOT:
    - Perform business logic
    - Manage application state
    """

    def __init__(self, config: "ConfigManager") -> None:
        """Initialize component."""
        super().__init__()
        self.config = config
        # UI code here
```

### New Service/Manager Template

```python
"""New service for WriteWise AI."""

import logging
from typing import Optional


class MyManager:
    """
    My custom manager.
    
    Responsibilities:
    - Single concern here
    
    Do not:
    - Mix responsibilities
    """

    def __init__(self) -> None:
        """Initialize manager."""
        self.logger = logging.getLogger(__name__)
        self.logger.info("MyManager initialized")
```

---

## How to Add Components

### Step 1: Create the component

Create `app/my_component.py` or `ui/my_component.py`:

```python
class MyComponent:
    def __init__(self, config):  # Inject dependencies
        self.config = config
```

### Step 2: Register in controller

Edit `app/controller.py`, in `__init__`:

```python
from app.my_component import MyComponent

class ApplicationController:
    def __init__(self, qt_app):
        # ... existing code ...
        self.my_component = MyComponent(self.config)
```

### Step 3: Initialize in start()

Edit `app/controller.py`, in `start()`:

```python
def start(self) -> None:
    # ... existing code ...
    self._logger.debug("Creating MyComponent")
    self.my_component = MyComponent(self.config)
    # ... rest of code ...
```

### Step 4: Cleanup in shutdown()

Edit `app/controller.py`, in `shutdown()`:

```python
def shutdown(self) -> None:
    # ... existing code ...
    try:
        if self.my_component is not None:
            self.my_component.cleanup()  # if needed
    except Exception as e:
        self._logger.warning(f"Error cleaning up: {e}")
```

---

## Common Operations

### Get Configuration Value

```python
width = self.config.get("window.width", 800)  # Default: 800
title = self.config.get("window.title")
```

### Set Configuration Value

```python
self.config.set("window.width", 1024)
self.config.set("features.enable_tray_icon", True)
```

### Save Configuration

```python
self.config.save()  # Saves to ./data/config.json
```

### Log Messages

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Informational message")
logger.warning("Warning message")
logger.error("Error message")
logger.debug("Debug message")
```

### Emit Signal from UI

```python
from PySide6.QtCore import Signal, QObject

class MySignals(QObject):
    my_signal = Signal(str)  # Can pass data

self._signals = MySignals()
self.my_signal = self._signals.my_signal

# Emit:
self.my_signal.emit("data")

# Connect:
component.my_signal.connect(handler)
```

---

## Rules to Follow

### ✅ DO

- ✅ Use type hints: `def method(self, name: str) -> bool:`
- ✅ Add docstrings to modules, classes, methods
- ✅ Use logging: `logger.info("message")`
- ✅ Inject dependencies: `def __init__(self, dep):`
- ✅ Emit signals: `self.signal.emit(data)`
- ✅ Keep it focused: One responsibility per class
- ✅ Use relative imports within app: `from app.config import ConfigManager`

### ❌ DON'T

- ❌ Use print(): `print("message")`  → Use `logger.info("message")`
- ❌ Use globals: `GLOBAL_VAR = {}` → Pass as parameter
- ❌ Direct method calls between UI: `self.window.show()` → Emit signal
- ❌ Hardcode values: `width = 800` → Use `config.get("window.width")`
- ❌ Create dependencies inside: `self.logger = Logger()` → Pass in constructor
- ❌ Mix concerns: Business logic + UI in same class
- ❌ Use absolute imports: `from app.config ...` (in same package)

---

## Lifecycle Diagram

```
main.py starts
    │
    ▼
Create QApplication
    │
    ▼
Create ApplicationController(app)
    │
    ├─ __init__ creates ConfigManager
    ├─ __init__ creates LoggerManager
    ├─ __init__ stores state
    │
    ▼
controller.start()
    │
    ├─ Create MainWindow(config)
    ├─ Create TrayIcon(main_window)
    ├─ Connect signals
    ├─ Show main window
    │
    ▼
app.exec() - Event loop runs
    │
    ├─ User interactions
    ├─ Signal handlers execute
    │
    ▼
User clicks "Exit"
    │
    ├─ TrayIcon emits exit_requested
    ├─ Connected to controller.shutdown()
    │
    ▼
controller.shutdown()
    │
    ├─ Save config
    ├─ Hide tray icon
    ├─ Close windows
    ├─ app.quit()
    │
    ▼
app.exec() returns
    │
    ▼
sys.exit()
    │
    ▼
Process ends
```

---

## Testing Quick Start

### Basic Test Template

```python
"""Tests for my component."""

from unittest.mock import Mock
from app.config import ConfigManager


def test_my_component():
    """Test my component."""
    config = Mock(spec=ConfigManager)
    component = MyComponent(config)
    
    assert component is not None
```

### Run Tests

```bash
pytest tests/ -v
```

---

## Common Issues & Solutions

### "ModuleNotFoundError: No module named 'app'"

**Solution:** Run from project root directory:
```bash
cd d:\Projects\WriteWiseAI
python main.py
```

### "No logger named 'MyModule'"

**Solution:** Set up logger in module:
```python
import logging

logger = logging.getLogger(__name__)
# Use logger.info(), logger.error(), etc.
```

### "Tray icon doesn't appear"

**Solution:** Check:
1. `enable_tray_icon=True` in config
2. Icon file exists at `assets/icons/app_icon.png`
3. System tray is available (check console for warnings)

### "Config not saving"

**Solution:** Call `config.save()`:
```python
self.config.set("key", value)
self.config.save()  # Don't forget this!
```

---

## Architecture Rules (Non-Negotiable)

| Rule | Why | Example |
|------|-----|---------|
| main.py ≤ 20 lines | Simplicity | No logic, just create & start |
| Controller owns components | Clear ownership | No circular dependencies |
| Dependency injection | Testability | Pass config to MainWindow |
| Type hints required | IDE support | `def method(self, x: int) -> str:` |
| Signals for UI communication | Loose coupling | `signal.connect(handler)` |
| No globals | State management | Pass as parameter instead |
| Use logging module | Visibility | `logger.info()` not `print()` |
| Single responsibility | Maintainability | One job per class |

---

## Key Files to Reference

- **Architecture Definition:** `FROZEN_ARCHITECTURE.md`
- **Refactoring Details:** `REFACTORING_SUMMARY.md`
- **Main Implementation:** `app/controller.py`
- **Config Template:** `app/config.py`
- **Logger Template:** `app/logger.py`

---

## Quick Links

| Need | File |
|------|------|
| Understand architecture | FROZEN_ARCHITECTURE.md |
| See what changed | REFACTORING_SUMMARY.md |
| Add new component | (Follow templates above) |
| Configure app | app/config.py |
| Check logging | app/logger.py |
| Main entry point | main.py |

---

**Version:** 1.0.0 (Frozen)  
**Date:** 2026-07-06  
**Status:** ✅ Production Ready
