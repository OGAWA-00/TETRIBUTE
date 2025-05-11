const listeners = {};

export function emit(event, payload) {
    (listeners[event] || []).forEach((handler) => handler(payload));
}

export function on(event, handler) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
}
