// data/data.js repo/entry.js

// A repository with persistence using IndexedDB.
class Repository {
	// Constructs an empty repository.
	constructor() {
		this.data = null;
		this.connection = null;
	}
	// Initializes this repository from IndexedDB.
	async initialize() {
		let repository = this;
		this.connection = await new Promise(function(resolve, reject) {
			let request = indexedDB.open("prudent-web", 1);
			request.onupgradeneeded = function(event) {
				let connection = request.result;
				connection.createObjectStore("snapshot");
				connection.createObjectStore("journal", { autoIncrement: true });
			};
			request.onsuccess = function(event) {
				resolve(request.result);
			};
			request.onerror = function(event) {
				reject(request.error);
			};
		});
		let value = await new Promise(function(resolve, reject) {
			let transaction = repository.connection.transaction("snapshot", "readonly");
			let request = transaction.objectStore("snapshot").get("value");
			request.onsuccess = function(event) {
				resolve(request.result);
			};
			request.onerror = function(event) {
				reject(request.error);
			};
		});
		if(value === undefined) {
			this.data = new Data();
		} else {
			let snapshot = value;
			this.data = Data.restore(snapshot);
		}
		{
			let generator = async function*() {
				let transaction = repository.connection.transaction("journal", "readwrite");
				let request = transaction.objectStore("journal").openCursor(null, "prev");
				while(true) {
					let cursor = await new Promise(function(resolve, reject) {
						request.onsuccess = function(event) {
							resolve(request.result);
						};
						request.onerror = function(event) {
							reject(request.error);
						};
					});
					if(cursor === null) {
						break;
					}
					yield cursor;
					cursor.continue();
				}
			};
			for await(let cursor of generator()) {
				let object = cursor.value;
				if(object === null) {
					break;
				}
				await new Promise(function(resolve, reject) {
					let request = cursor.delete();
					request.onsuccess = function(event) {
						resolve(request.result);
					};
					request.onerror = function(event) {
						reject(request.error);
					};
				});
			}
		}
		{
			let generator = async function*() {
				let transaction = repository.connection.transaction("journal", "readonly");
				let request = transaction.objectStore("journal").openCursor(null, "next");
				while(true) {
					let cursor = await new Promise(function(resolve, reject) {
						request.onsuccess = function(event) {
							resolve(request.result);
						};
						request.onerror = function(event) {
							reject(request.error);
						};
					});
					if(cursor === null) {
						break;
					}
					yield cursor;
					cursor.continue();
				}
			};
			for await(let cursor of generator()) {
				let object = cursor.value;
				if(object !== null) {
					Entry.deserialize(this.data, object).execute(this.data)
				}
			}
		}
	}
	// Performs the action given by `entry` and adds it to the journal. Mutates this repository.
	perform(entry) {
		let repository = this;
		let object = Entry.serialize(this.data, entry);
		entry.execute(this.data);
		return new Promise(function(resolve, reject) {
			let transaction = repository.connection.transaction("journal", "readwrite");
			let request = transaction.objectStore("journal").add(object);
			request.onerror = function(event) {
				reject(request.error);
			};
			transaction.oncomplete = function(event) {
				resolve();
			};
		});
	}
	// Commits the current transaction and begins a new one.
	commit() {
		let repository = this;
		return new Promise(function(resolve, reject) {
			let transaction = repository.connection.transaction("journal", "readwrite");
			let request = transaction.objectStore("journal").add(null);
			request.onerror = function(event) {
				reject(request.error);
			};
			transaction.oncomplete = function(event) {
				resolve();
			};
		});
	}
	// Materializes the state of this repository.
	materialize() {
		let repository = this;
		let snapshot = Data.save(this.data);
		return new Promise(function(resolve, reject) {
			let transaction = repository.connection.transaction([ "snapshot", "journal" ], "readwrite");
			{
				let request = transaction.objectStore("snapshot").put(snapshot, "value");
				request.onerror = function(event) {
					reject(request.error);
				};
			}
			{
				let request = transaction.objectStore("journal").clear();
				request.onerror = function(event) {
					reject(request.error);
				};
			}
			transaction.oncomplete = function(event) {
				resolve();
			};
		});
	}
	// Registers `set`, assuming it is empty. Mutates this repository.
	register_set(set) {
		return this.perform(new Entry(EntryRegisterSet, new EntryRegisterSet(set)));
	}
	// Deregisters `set`. Mutates this repository.
	deregister_set(set) {
		return this.perform(new Entry(EntryDeregisterSet, new EntryDeregisterSet(set)));
	}
	// Registers `task` as an incomplete task. Mutates this repository.
	register_task(task) {
		return this.perform(new Entry(EntryRegisterTask, new EntryRegisterTask(task)));
	}
	// Deregisters `task`, assuming it has no dependents. Mutates this repository.
	deregister_task(task) {
		return this.perform(new Entry(EntryDeregisterTask, new EntryDeregisterTask(task)));
	}
	// Adds `operation`. Mutates this repository.
	add_operation(operation) {
		return this.perform(new Entry(EntryAddOperation, new EntryAddOperation(operation)));
	}
	// Inserts `task` before `index` in the completion front. Mutates this repository.
	insert_completion_front(index, task) {
		return this.perform(new Entry(EntryInsertCompletionFront, new EntryInsertCompletionFront(index, task)));
	}
	// Deletes the task at `index` from the completion front. Mutates this repository.
	delete_completion_front(index) {
		return this.perform(new Entry(EntryDeleteCompletionFront, new EntryDeleteCompletionFront(index)));
	}
	// Inserts `task` before `index` in the uncompletion front. Mutates this repository.
	insert_uncompletion_front(index, task) {
		return this.perform(new Entry(EntryInsertUncompletionFront, new EntryInsertUncompletionFront(index, task)));
	}
	// Deletes the task at `index` from the uncompletion front. Mutates this repository.
	delete_uncompletion_front(index) {
		return this.perform(new Entry(EntryDeleteUncompletionFront, new EntryDeleteUncompletionFront(index)));
	}
}
