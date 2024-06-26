// data/data.js

// A dummy repository without persistence.
class Repository {
	// Constructs an empty repository.
	constructor() {
		this.data = new Data();
	}
	// Registers `task` as an incomplete task. Mutates this repository.
	register_task(task) {
		this.data.registry.add(task);
		for(let dependency of task.dependencies) {
			this.data.registry.add_relationship(dependency, task);
		}
	}
	// Completes `task`, assuming it is a minimal uncomplete task. Mutates this repository.
	complete(task) {
		this.data.completed.add_min_out(task);
	}
	// Completes `task`, assuming it is a maximal complete task. Mutates this repository.
	uncomplete(task) {
		this.data.completed.remove_max_in(task);
	}
	// Inserts `task` before `index` in the completion front. Mutates this repository.
	insert_completion_front(index, task) {
		this.data.completion_front.splice(index, 0, task);
	}
	// Deletes the task at `index` from the completion front. Mutates this repository.
	delete_completion_front(index) {
		this.data.completion_front.splice(index, 1);
	}
	// Inserts `task` before `index` in the uncompletion front. Mutates this repository.
	insert_uncompletion_front(index, task) {
		this.data.uncompletion_front.splice(index, 0, task);
	}
	// Deletes the task at `index` from the uncompletion front. Mutates this repository.
	delete_uncompletion_front(index) {
		this.data.uncompletion_front.splice(index, 1);
	}
}
