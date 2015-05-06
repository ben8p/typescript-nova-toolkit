/**
 * Disposable class is an helper for cleaning up memory
 * It act as a store, collect all items that you want to destroy
 * And clean then when you call dispose()
 */
export interface Interface {
	own?(...items: any[]): void;
	dispose?(): boolean;
}
export class Class implements Interface{
	private disposable: any[] = [];

	/** add items to the disposable array */
	own(...items: any[]): void {
		this.disposable = this.disposable.concat(items);
	}

	/**
	 * clean up everything that can be cleaned
	 * if fasle is returned, some element were not disposed
	 */
	dispose(): boolean {
		var disposed = true;
		this.disposable.forEach((item: any) => {
			var processed = false;
			if (item && typeof item === 'object') {
				if (item.tagName && item.parentNode) { //a node, attached to the dom
					item.parentNode.removeChild(item);
					processed = true;
				} else if (typeof item.remove === 'function') { //an event ?
					item.remove();
					processed = true;
				} else if (typeof item.dispose === 'function') { //an disposable object ?
					item.dispose();
					processed = true;
				}
			} else if (item && typeof item === 'number') { //a timeout/interval handle
				clearInterval(item);
				clearTimeout(item);
				processed = true;
			}

			if (!processed && disposed) {
				disposed = false;
			}
		});
		return disposed;
	}
}
