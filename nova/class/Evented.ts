/**
 * represent an evented class
 * implements EventTarget interface
 */

export interface Interface {
	removeEventListener?(type: string, listener: EventListenerObject): void;
	addEventListener?(type: string, listener: EventListenerObject): void;
	dispatchEvent?(event: Event): boolean;
}
export class Class implements EventTarget, Interface {
	private events: any = {};
	/**
	 * detach a handler from an event type in the event bus
	 * @param	type		the type event to attach
	 * @param	listener	the handler to attach
	 */
	removeEventListener(type: string, listener: EventListenerObject): void {
		var handlers = <EventListenerObject[]> this.events[type];
		handlers.some((handler, index) => {
			if (handler === listener) {
				handlers[index] = null;
				return true;
			}
			return false;
		});
	}
	/**
	 * attach a handler to an event type in the event bus
	 * @param	type		the type event to attach
	 * @param	listener	the handler to attach
	 */
	addEventListener(type: string, listener: EventListenerObject): void {
		this.events[type] = this.events[type] || [];
		this.events[type].push(listener);
	}
	/**
	 * dispatch a event to the event bus
	 * does not execute other handlers if preventDefault() is called on the event
	 * @param	event	the event to dispatch
	 * @return	boolean
	 */
	dispatchEvent(event: Event): boolean {
		var handlers = <Function[]> this.events[event.type];
		if (!handlers || handlers.length === 0) { return true; }
		handlers.forEach((handler) => {
			if (event.defaultPrevented) { return; }
			if (typeof handler === 'function') {
				handler(event);
			}
		});
		return true;
	}
}
