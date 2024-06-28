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
