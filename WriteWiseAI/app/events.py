"""
Application-wide event definitions.

Provides event signals for application lifecycle and state changes,
enabling loose coupling between components.
"""

from enum import Enum, auto
from typing import Any, Callable, List


class ApplicationEvent(Enum):
    """Enumeration of application lifecycle events."""

    STARTING = auto()
    STARTED = auto()
    SHUTTING_DOWN = auto()
    SHUTDOWN_COMPLETE = auto()


class EventBus:
    """
    Simple event bus for application-wide event publishing and subscription.

    Uses a publisher-subscriber pattern to enable loose coupling between
    application components.
    """

    def __init__(self) -> None:
        """Initialize the event bus."""
        self._subscribers: dict[ApplicationEvent, List[Callable[[Any], None]]] = {}

    def subscribe(
        self, event: ApplicationEvent, callback: Callable[[Any], None]
    ) -> None:
        """
        Subscribe to an application event.

        Args:
            event: The event to subscribe to.
            callback: The callback function to invoke when event is published.
        """
        if event not in self._subscribers:
            self._subscribers[event] = []
        self._subscribers[event].append(callback)

    def unsubscribe(
        self, event: ApplicationEvent, callback: Callable[[Any], None]
    ) -> None:
        """
        Unsubscribe from an application event.

        Args:
            event: The event to unsubscribe from.
            callback: The callback function to remove.
        """
        if event in self._subscribers:
            if callback in self._subscribers[event]:
                self._subscribers[event].remove(callback)

    def publish(self, event: ApplicationEvent, data: Any = None) -> None:
        """
        Publish an event to all subscribers.

        Args:
            event: The event to publish.
            data: Optional data to pass to subscribers.
        """
        if event in self._subscribers:
            for callback in self._subscribers[event]:
                try:
                    callback(data)
                except Exception as e:
                    # Log but don't crash on subscriber errors
                    print(f"Error in event subscriber for {event}: {e}")
