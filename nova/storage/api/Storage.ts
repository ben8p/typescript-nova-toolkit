/** common interface for StorageObject */
export interface StorageObject {
	length: number;
	key(index: number): string;
	getItem(key: string): any;
	setItem(key: string, value: any): void;
	removeItem(key: string): void;
	clear(): void;
}
/** internal interface for absctract class only */
interface IAbstractStorage extends StorageObject {
	getStorage(): StorageObject;
}
/**
 * This is the abstract class for all storage
 * It cannot be used on its own
 * provide a convenient way to save/retrieve information in the browser scope
 * see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
 */
export class AbtractStorage implements IAbstractStorage {
	/** number of items in the storage */
	length: number = 0;

	/** construct the class, map the .length property */
	constructor() {
		Object.defineProperty(this, 'length', {
			get: () => {
				return this.getStorage().length;
			}
		});
	}

	/** placeholder method. Must be overridden and should return the StorageObject */
	getStorage(): StorageObject {
		return null;
	}
	/**
	 * The getItem(key) method must return the current value associated with the given key.
	 * If the given key does not exist in the list associated with the object then this method must return null.
	 * @param	key	storage's key
	 * @return		stored value
	 */
	getItem(key: string): any {
		var item = this.getStorage().getItem(key);
		if (item) {
			if (item.value !== undefined) {
				return item.value;
			}
			item = JSON.parse(item);

			switch (item.Ctr) {
			case 'String':
				item = item.value;
				break;
			case 'Number':
				item = Number(item.value);
				break;
			case 'Boolean':
				item = Boolean(item.value);
				break;
			case 'JSON':
				item = JSON.parse(item.value);
				break;
			case 'UNDEFINED':
				item = undefined;
				break;
			}
		}
		return item;
	}
	/**
	 * The key(n) method must return the name of the nth key in the list (this is not necessarily the order in which items are added!).
	 * The order of keys is user-agent defined, but must be consistent within an object so long as the number of keys doesn't change.
	 * (Thus, adding or removing a key may change the order of the keys, but merely changing the value of an existing key must not.)
	 * If n is greater than or equal to the number of key/value pairs in the object, then this method must return null.
	 * @param	index	the index of the key to get
	 * @return			the key
	 */
	key(index: number): string {
		//In IE : storage.key() throws an error if @index does not exist
		try {
			return this.getStorage().key(index);
		} catch (e) {
			return null;
		}
	}
	/**
	 * The setItem(key, value) method must first check if a key/value pair with the given key already exists in the list associated with the object.
	 * @param	key		the key to set the item in
	 * @param	value	the value to set
	 */
	setItem(key: string, value: any): void {
		if (!key) { return; }

		//convert all type to String before saving
		switch (typeof value) {
		case 'string':
			value = {Ctr: 'String', value: value};
			break;
		case 'number':
			value = {Ctr: 'Number', value: value.toString()};
			break;
		case 'boolean':
			value = {Ctr: 'Boolean', value: value ? 'true' : ''};
			break;
		case 'object':
			value = {Ctr: 'JSON', value: JSON.stringify(value)};
			break;
		case 'undefined':
			value = {Ctr: 'UNDEFINED', value: value};
			break;
		}

		 this.getStorage().setItem(key, JSON.stringify(value));
	}

	/**
	 * The removeItem(key) method must cause the key/value pair with the given key to be removed from the list associated with the object, if it exists.
	 * If no item with that key exists, the method must do nothing.
	 * @param	key	the key to remove
	 */
	removeItem(key: string): void {
		this.getStorage().removeItem(key);
	}
	/**
	 * empty the page storage
	 */
	clear(): void {
		this.getStorage().clear();
	}
};
