// repo/repository.js

class Model {
	constructor() {
		this.repository = new Repository();
	}
	// Registers `task`. Mutates this model.
	register_task(task) {
		this.repository.register_task(task);
		if(this.repository.data.completed.is_min_out(task)) {
			let index = this.repository.data.completion_front.length;
			this.repository.insert_completion_front(index, task);
		}
	}
	// Completes the first task in the completion front, assuming it exists. Mutates this model.
	complete() {
		let task = this.repository.data.completion_front[0];
		this.repository.complete(task);
		this.repository.delete_completion_front(0);
		for(let dependent of this.repository.data.registry.get_relation().get_image(task)) {
			if(this.repository.data.completed.is_min_out(dependent)) {
				let index = this.repository.data.completion_front.length;
				this.repository.insert_completion_front(index, dependent);
			}
		}
		for(let index = this.repository.data.uncompletion_front.length - 1; index >= 0; index--) {
			let dependency = this.repository.data.uncompletion_front[index];
			if(!this.repository.data.completed.is_max_in(dependency)) {
				this.repository.delete_uncompletion_front(index);
			}
		}
		let index = this.repository.data.uncompletion_front.length;
		this.repository.insert_uncompletion_front(index, task);
	}
	// Moves the first task in the completion front to the end, assuming it exists. Mutates this model.
	cycle() {
		let task = this.repository.data.completion_front[0];
		this.repository.delete_completion_front(0);
		let index = this.repository.data.completion_front.length;
		this.repository.insert_completion_front(index, task);
	}
}
