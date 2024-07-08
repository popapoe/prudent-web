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
	constructor(key, el, is_in, causes) {
		this.key = key;
		this.el = el;
		this.is_in = is_in;
		this.causes = causes;
	}
	static create(el, is_in, causes) {
		let key = crypto.randomUUID();
		return new Operation(key, el, is_in, causes);
	}
}
