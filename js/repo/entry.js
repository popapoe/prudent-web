// data/objects.js

class EntryTypeRegistry {
	constructor() {
		this.types = new Map();
	}
	get_types() {
		return this.types;
	}
	register(type) {
		this.types.set(type.name, type);
	}
}

class EntryRegisterTask {
	constructor(task) {
		this.task = task;
	}
	async execute(data) {
		data.register_task(this.task);
	}
	static name = "register task";
	static serialize(data, entry) {
		let dependency_keys = [];
		for(let dependency of entry.task.dependencies) {
			dependency_keys.push(dependency.key);
		}
		return {
			key: entry.task.key,
			title: entry.task.title,
			description: entry.task.description,
			dependency_keys: dependency_keys,
		};
	}
	static deserialize(data, object) {
		let dependencies = [];
		for(let dependency_key of object.dependency_keys) {
			dependencies.push(data.tasks.get(dependency_key));
		}
		return new EntryRegisterTask(new Task(object.key, object.title, object.description, dependencies));
	}
}

class EntryComplete {
	constructor(task) {
		this.task = task;
	}
	async execute(data) {
		data.completed.add_min_out(this.task);
	}
	static name = "complete";
	static serialize(data, entry) {
		return entry.task.key;
	}
	static deserialize(data, object) {
		return new EntryComplete(data.tasks.get(object));
	}
}

class EntryUncomplete {
	constructor(task) {
		this.task = task;
	}
	async execute(data) {
		data.completed.remove_max_in(this.task);
	}
	static name = "uncomplete";
	static serialize(data, entry) {
		return entry.task.key;
	}
	static deserialize(data, object) {
		return new EntryUncomplete(data.tasks.get(object));
	}
}

class EntryInsertCompletionFront {
	constructor(index, task) {
		this.index = index;
		this.task = task;
	}
	async execute(data) {
		data.completion_front.splice(this.index, 0, this.task);
	}
	static name = "insert completion front";
	static serialize(data, entry) {
		return {
			index: entry.index,
			key: entry.task.key,
		};
	}
	static deserialize(data, object) {
		return new EntryInsertCompletionFront(object.index, data.tasks.get(object.key));
	}
}

class EntryDeleteCompletionFront {
	constructor(index) {
		this.index = index;
	}
	async execute(data) {
		data.completion_front.splice(this.index, 1);
	}
	static name = "delete completion front";
	static serialize(data, entry) {
		return entry.index;
	}
	static deserialize(data, object) {
		return new EntryDeleteCompletionFront(object);
	}
}

class EntryInsertUncompletionFront {
	constructor(index, task) {
		this.index = index;
		this.task = task;
	}
	async execute(data) {
		data.uncompletion_front.splice(this.index, 0, this.task);
	}
	static name = "insert uncompletion front";
	static serialize(data, entry) {
		return {
			index: entry.index,
			key: entry.task.key,
		};
	}
	static deserialize(data, object) {
		return new EntryInsertUncompletionFront(object.index, data.tasks.get(object.key));
	}
}

class EntryDeleteUncompletionFront {
	constructor(index) {
		this.index = index;
	}
	async execute(data) {
		data.uncompletion_front.splice(this.index, 1);
	}
	static name = "delete uncompletion front";
	static serialize(data, entry) {
		return entry.index;
	}
	static deserialize(data, object) {
		return new EntryDeleteUncompletionFront(object);
	}
}

let entry_type_registry = new EntryTypeRegistry();
entry_type_registry.register(EntryRegisterTask);
entry_type_registry.register(EntryComplete);
entry_type_registry.register(EntryUncomplete);
entry_type_registry.register(EntryInsertCompletionFront);
entry_type_registry.register(EntryDeleteCompletionFront);
entry_type_registry.register(EntryInsertUncompletionFront);
entry_type_registry.register(EntryDeleteUncompletionFront);

class Entry {
	constructor(type, inner) {
		this.type = type;
		this.inner = inner;
	}
	execute(data) {
		return this.inner.execute(data);
	}
	static serialize(data, entry) {
		return {
			type: entry.type.name,
			inner: entry.type.serialize(data, entry.inner),
		};
	}
	static deserialize(data, object) {
		let type = entry_type_registry.get_types().get(object.type);
		return new Entry(type, type.deserialize(data, object.inner));
	}
}
