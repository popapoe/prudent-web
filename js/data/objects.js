class Task {
	constructor(key, title, description, dependencies) {
		this.key = key;
		this.title = title;
		this.description = description;
		this.dependencies = dependencies;
	}
	static create(title, description, dependencies) {
		let key = crypto.randomUUID();
		return new Task(key, title, description, dependencies);
	}
}

class Operation {
	constructor(key, el, set, is_in, causes) {
		this.key = key;
		this.el = el;
		this.set = set;
		this.is_in = is_in;
		this.causes = causes;
	}
	static create(el, set, is_in, causes) {
		let key = crypto.randomUUID();
		return new Operation(key, el, set, is_in, causes);
	}
}

class Set_ {
	constructor(key, title, description, set) {
		this.key = key;
		this.title = title;
		this.description = description;
		this.set = set;
	}
	static create(title, description, set) {
		let key = crypto.randomUUID();
		return new Set_(key, title, description, set);
	}
}
