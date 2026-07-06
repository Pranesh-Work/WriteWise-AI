# ApplicationController Visual Overview

## Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            main.py                                  │
│                                                                     │
│  def main():                                                        │
│      controller = initialize_application()  ←───────┐              │
│      controller.start()                              │              │
│      sys.exit(controller.app.exec())                 │              │
└─────────────────────────────────────────────────────┼──────────────┘
                                                      │
                                                      ↓
                          ┌─────────────────────────────────────────┐
                          │  initialize_application()               │
                          │  (Factory Function)                     │
                          │                                         │
                          │  1. Create QApplication                 │
                          │  2. Initialize ApplicationLogger        │
                          │  3. Create ApplicationConfig            │
                          │  4. Return ApplicationController        │
                          └─────────────────────────────────────────┘
                                          │
                                          ↓
        ┌─────────────────────────────────────────────────────────────┐
        │                  ApplicationController                      │
        │                                                             │
        │  ┌────────────────────────────────────────────────────┐    │
        │  │  Attributes:                                       │    │
        │  │  - app: QApplication                               │    │
        │  │  - config: ApplicationConfig                       │    │
        │  │  - logger: ApplicationLogger                       │    │
        │  │  - event_bus: EventBus                             │    │
        │  │  - main_window: MainWindow                         │    │
        │  │  - settings_window: SettingsWindow                 │    │
        │  │  - tray_icon: TrayIcon                             │    │
        │  └────────────────────────────────────────────────────┘    │
        │                                                             │
        │  ┌────────────────────────────────────────────────────┐    │
        │  │  Public Methods:                                   │    │
        │  │  • start() - Start application                     │    │
        │  │  • shutdown() - Graceful shutdown                  │    │
        │  │  • show_settings() - Show settings window          │    │
        │  │  • show_main_window() - Show main window           │    │
        │  │  • is_running() - Check if running                 │    │
        │  └────────────────────────────────────────────────────┘    │
        │                                                             │
        │  ┌────────────────────────────────────────────────────┐    │
        │  │  Private Methods:                                  │    │
        │  │  • _initialize_components()                        │    │
        │  │  • _cleanup_components()                           │    │
        │  │  • _apply_configuration()                          │    │
        │  │  • _on_settings_applied()                          │    │
        │  └────────────────────────────────────────────────────┘    │
        └─────────────────────────────────────────────────────────────┘
                 │                      │                    │
        ┌────────┴────────┬─────────────┴────────┬──────────┴──────────┐
        ↓                 ↓                      ↓                     ↓
   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
   │ MainWindow  │  │SettingsWindow│  │   TrayIcon       │  │  EventBus    │
   ├─────────────┤  ├──────────────┤  ├──────────────────┤  ├──────────────┤
   │ Widgets     │  │ Signals:     │  │ Signals:         │  │ Events:      │
   │ Layout      │  │ • on_apply   │  │ • show_requested │  │ • STARTING   │
   │ Content     │  │ • on_cancel  │  │ • settings_...   │  │ • STARTED    │
   │             │  │              │  │ • exit_requested │  │ • SHUTTING..│
   │             │  │              │  │                  │  │ • SHUTDOWN..│
   └─────────────┘  └──────────────┘  └──────────────────┘  └──────────────┘
```

## Startup Sequence (Sequence Diagram)

```
main.py                    QApplication        ApplicationController
   │                             │                      │
   ├──────────────────────────────────────────────────────────────────►
   │  initialize_application()
   │
   ├──────────────────────────────────────────────────────────────────►
   │  Create ApplicationLogger (singleton)
   │
   ├──────────────────────────────────────────────────────────────────►
   │  Create ApplicationConfig
   │
   ├──────────────────────────────────────────────────────────────────►
   │  Create ApplicationController(app, config)
   │◄──────────────────────────────────────────────────────────────────
   │  controller initialized
   │
   ├──────────────────────────────────────────────────────────────────►
   │  controller.start()
   │                                                   │
   │                                                   ├─ Validate state
   │                                                   │
   │                                                   ├─ Publish STARTING event
   │                                                   │
   │                                                   ├─ _initialize_components()
   │                                                   │  ├─ Create MainWindow
   │                                                   │  ├─ Create SettingsWindow
   │                                                   │  └─ Create TrayIcon
   │                                                   │
   │                                                   ├─ _apply_configuration()
   │                                                   │  └─ Apply window settings
   │                                                   │
   │                                                   ├─ Show main window
   │                                                   │
   │                                                   ├─ Mark as running
   │                                                   │
   │                                                   └─ Publish STARTED event
   │◄──────────────────────────────────────────────────────────────────
   │  startup complete
   │
   ├──────────────────────────────────────────────────────────────────►
   │  app.exec() [Event loop]
   │
   │  (User interaction, events processed)
   │
   ├──────────────────────────────────────────────────────────────────►
   │  controller.shutdown()  [or window closed]
   │                                                   │
   │                                                   ├─ Check not already shutting down
   │                                                   │
   │                                                   ├─ Publish SHUTTING_DOWN event
   │                                                   │
   │                                                   ├─ _cleanup_components()
   │                                                   │  ├─ Hide TrayIcon
   │                                                   │  ├─ Close MainWindow
   │                                                   │  └─ Close SettingsWindow
   │                                                   │
   │                                                   ├─ Mark as not running
   │                                                   │
   │                                                   └─ Publish SHUTDOWN_COMPLETE event
   │◄──────────────────────────────────────────────────────────────────
   │  shutdown complete
   │
   └──────────────────────────────────────────────────────────────────►
      sys.exit(app.exec())
```

## Dependency Injection Pattern

```
Traditional Approach (Tight Coupling):
┌─────────────────────┐
│ ApplicationController │
├─────────────────────┤
│                     │
│ __init__(app):      │
│   self.app = app    │
│   self.logger = ... │  ✗ Creates its own dependencies
│   self.config = ... │
│   self.window = ... │
│                     │
└─────────────────────┘


Dependency Injection Approach (Loose Coupling):
┌──────────────────────────────────────────┐
│ ApplicationController                    │
├──────────────────────────────────────────┤
│                                          │
│ __init__(app, config=None,               │
│          logger=None,                    │
│          event_bus=None):                │
│   self.app = app                         │ ✓ Dependencies injected
│   self.config = config or default        │   or use defaults
│   self.logger = logger or default        │
│   self.event_bus = event_bus or default  │
│                                          │
└──────────────────────────────────────────┘
          ▲         ▲         ▲
          │         │         │
   ┌──────┴────┬─────┴──┬─────┴──────┐
   │           │        │            │
   ▼           ▼        ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ QApp   │ │ Config │ │ Logger │ │ Events │
└────────┘ └────────┘ └────────┘ └────────┘

Benefits:
✓ Easy to test (inject mocks)
✓ Easy to customize behavior
✓ Loose coupling between components
✓ Single responsibility maintained
```

## Configuration Object Pattern

```
┌─────────────────────────────────────────┐
│       ApplicationConfig                 │
├─────────────────────────────────────────┤
│  app_name: str                          │
│  version: str                           │
│  window: WindowConfig                   │
│  ├─ title: str                          │
│  ├─ width: int                          │
│  ├─ height: int                         │
│  ├─ min_width: int                      │
│  ├─ min_height: int                     │
│  └─ remember_position: bool             │
│  assets_dir: Path                       │
│  logs_dir: Path                         │
│  data_dir: Path                         │
│  enable_tray_icon: bool                 │
│  enable_start_minimized: bool           │
│  enable_auto_update: bool               │
│  debug_mode: bool                       │
├─────────────────────────────────────────┤
│  Methods:                               │
│  • __post_init__() - Validate paths     │
│  • from_dict() - Create from dict       │
│  • to_dict() - Export to dict           │
└─────────────────────────────────────────┘

Usage:
config = ApplicationConfig(
    app_name="My App",
    debug_mode=True,
    window=WindowConfig(width=1024, height=768),
)
```

## Event Bus Pub/Sub Pattern

```
Publisher (ApplicationController)
    │
    ├─ event_bus.publish(ApplicationEvent.STARTING)
    │
    ├─ event_bus.publish(ApplicationEvent.STARTED)
    │
    ├─ event_bus.publish(ApplicationEvent.SHUTTING_DOWN)
    │
    └─ event_bus.publish(ApplicationEvent.SHUTDOWN_COMPLETE)
            │
            │  (published to all subscribers)
            │
    ┌───────┴────────┬─────────────┬────────────────┐
    │                │             │                │
    ▼                ▼             ▼                ▼
Subscriber A    Subscriber B  Subscriber C  Subscriber D
   │               │             │              │
   ├─ Execute      ├─ Execute     ├─ Execute    ├─ Execute
   │  callback 1   │  callback 2   │  callback 3 │  callback 4
   │               │              │              │
   ▼               ▼              ▼              ▼
(Decoupled operation - each subscriber independent)

Benefits:
✓ Loose coupling
✓ Easy to add/remove subscribers
✓ Exception isolation
✓ Scalable event handling
```

## File Organization

```
WriteWiseAI/
│
├── main.py                        Entry point
│
├── app/
│   ├── startup.py                 ApplicationController (main orchestrator)
│   ├── config.py                  ApplicationConfig & WindowConfig
│   ├── logger.py                  ApplicationLogger (singleton)
│   ├── events.py                  ApplicationEvent & EventBus
│   └── ARCHITECTURE.md            Detailed architecture guide
│
├── ui/
│   ├── main_window.py             MainWindow UI component
│   ├── settings_window.py         SettingsWindow with signals
│   └── tray_icon.py               TrayIcon with signals
│
├── tests/
│   └── test_controller.py         Unit & integration tests
│
├── IMPLEMENTATION_SUMMARY.md      This project summary
├── CONTROLLER_QUICK_REFERENCE.md  Quick lookup guide
│
└── logs/                          (auto-created log files)
```

## Component Lifecycle States

```
                        ┌─ IDLE ─┐
                        │        │
                        └────┬───┘
                             │ start()
                             ↓
                    ┌─ INITIALIZING ─┐
                    │                │
                    │ - Create UI     │
                    │ - Apply config  │
                    │ - Show window   │
                    │                │
                    └────────┬────────┘
                             │
                             ↓ (success)
                    ┌─ RUNNING ─┐
                    │           │
                    │ Event loop│
                    │ processing│
                    │           │
                    └────┬──────┘
                         │ shutdown()
                         ↓
                 ┌─ SHUTTING_DOWN ─┐
                 │                 │
                 │ - Hide UI        │
                 │ - Close windows  │
                 │ - Clean up       │
                 │                 │
                 └────────┬─────────┘
                          │
                          ↓ (complete)
                    ┌─ IDLE ─┐
                    │        │
                    └────────┘

States are tracked by:
• _is_running: bool
• _is_shutting_down: bool

Transitions:
• start() only works if not running and not shutting down
• shutdown() is idempotent (safe to call multiple times)
• Error during startup triggers immediate shutdown
```

## Type Hints & Type Safety

```
ApplicationController signature:

def __init__(
    self,
    app: QApplication,                          # Required
    config: Optional[ApplicationConfig] = None, # Optional
    logger: Optional[ApplicationLogger] = None, # Optional
    event_bus: Optional[EventBus] = None,       # Optional
) -> None:                                      # Returns nothing
    ...

Public method signatures:

def start(self) -> None:
def shutdown(self) -> None:
def show_settings(self) -> None:
def show_main_window(self) -> None:
def is_running(self) -> bool:

All components use full type hints for:
✓ IDE autocomplete
✓ Static type checking (mypy)
✓ Runtime type validation
✓ Self-documenting code
```

## Signal Connections (Loose Coupling)

```
┌─────────────────────────────────────────────────────────────┐
│                  ApplicationController                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  During _initialize_components():                          │
│                                                             │
│  settings_window.on_apply.connect(self._on_settings...)    │
│  tray_icon.show_requested.connect(self.show_main_window)   │
│  tray_icon.settings_requested.connect(self.show_settings)  │
│  tray_icon.exit_requested.connect(self.shutdown)           │
│                                                             │
│  Benefits:                                                  │
│  ✓ UI components don't know about controller               │
│  ✓ Controller doesn't directly call UI methods             │
│  ✓ Easy to change behavior by reconnecting signals         │
│  ✓ Testable with signal mocking                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
       │                                         │
       │                                         │
       ▼                                         ▼
   SettingsWindow                            TrayIcon
   • on_apply signal                         • show_requested signal
   • on_cancel signal                        • settings_requested signal
                                             • exit_requested signal
```

---

## Summary

This visual overview shows how all components work together in the production-ready ApplicationController implementation.

Key takeaways:
- **Orchestration**: Controller manages all other components
- **Dependency Injection**: All dependencies are injectable
- **Events**: Pub/Sub event system enables loose coupling
- **Signals**: Qt signals connect UI to controller without coupling
- **State Management**: Clear lifecycle states and transitions
- **Type Safety**: Full type hints throughout
