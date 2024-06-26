// data/lower-set.js

// An in-memory database.
class Data {
	// Constructs an empty database.
	constructor() {
		this.registry = new LowerSetRegistry();
		this.completed = this.registry.create();
		this.completion_front = [];
		this.uncompletion_front = [];
	}
}
