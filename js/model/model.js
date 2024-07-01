// repo/repository.js

class Model {
	constructor(repository) {
		this.repository = repository;
	}
	// Registers `task`. Mutates this model.
	async register_task(task) {
		await this.repository.register_task(task);
		if(this.repository.data.completed.is_min_out(task)) {
			let index = this.repository.data.completion_front.length;
			await this.repository.insert_completion_front(index, task);
		}
		await this.repository.commit();
	}
	// Completes the task with index `index` in the completion front, assuming it exists. Mutates this model.
	async complete(index) {
		let task = this.repository.data.completion_front[index];
		await this.repository.complete(task);
		await this.repository.delete_completion_front(index);
		for(let dependent of this.repository.data.registry.get_relation().get_image(task)) {
			if(this.repository.data.completed.is_min_out(dependent)) {
				await this.repository.insert_completion_front(this.repository.data.completion_front.length, dependent);
			}
		}
		for(let index = this.repository.data.uncompletion_front.length - 1; index >= 0; index--) {
			let dependency = this.repository.data.uncompletion_front[index];
			if(!this.repository.data.completed.is_max_in(dependency)) {
				await this.repository.delete_uncompletion_front(index);
			}
		}
		await this.repository.insert_uncompletion_front(this.repository.data.uncompletion_front.length, task);
		await this.repository.commit();
	}
	// Uncompletes the task with index `index` in the uncompletion front, assuming it exists. Mutates this model.
	async uncomplete(index) {
		let task = this.repository.data.uncompletion_front[index];
		await this.repository.uncomplete(task);
		await this.repository.delete_uncompletion_front(index);
		for(let dependency of this.repository.data.registry.get_relation().get_preimage(task)) {
			if(this.repository.data.completed.is_max_in(dependency)) {
				await this.repository.insert_uncompletion_front(this.repository.data.uncompletion_front.length, dependency);
			}
		}
		for(let index = this.repository.data.completion_front.length - 1; index >= 0; index--) {
			let dependent = this.repository.data.completion_front[index];
			if(!this.repository.data.completed.is_min_out(dependent)) {
				await this.repository.delete_completion_front(index);
			}
		}
		await this.repository.insert_completion_front(this.repository.data.completion_front.length, task);
		await this.repository.commit();
	}
	// Moves the first task in the completion front to the end, assuming it exists. Mutates this model.
	async cycle() {
		let task = this.repository.data.completion_front[0];
		await this.repository.delete_completion_front(0);
		let index = this.repository.data.completion_front.length;
		await this.repository.insert_completion_front(index, task);
		await this.repository.commit();
	}
}
