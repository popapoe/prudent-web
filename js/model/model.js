// data/objects.js repo/repository.js

class Model {
	constructor(repository) {
		this.repository = repository;
	}
	// Registers `task`. Mutates this model.
	async register_task(task) {
		await this.repository.register_task(task);
		if(this.repository.data.completed.set.is_min_not_definitely_in(task)) {
			let index = this.repository.data.completion_front.length;
			await this.repository.insert_completion_front(index, task);
		}
		await this.repository.commit();
	}
	// Completes the task with index `index` in the completion front, assuming it exists. Mutates this model.
	async complete(index) {
		let task = this.repository.data.completion_front[index];
		let causes = Array.from(this.repository.data.completed.set.get_history(task).get_recent());
		let operation = Operation.create(task, this.repository.data.completed, true, causes);
		await this.repository.add_operation(operation);
		await this.repository.delete_completion_front(index);
		for(let dependent of this.repository.data.registry.get_relation().get_image(task)) {
			if(this.repository.data.completed.set.is_min_not_definitely_in(dependent)) {
				await this.repository.insert_completion_front(this.repository.data.completion_front.length, dependent);
			}
		}
		for(let index = this.repository.data.uncompletion_front.length - 1; index >= 0; index--) {
			let dependency = this.repository.data.uncompletion_front[index];
			if(!this.repository.data.completed.set.is_max_not_definitely_out(dependency)) {
				await this.repository.delete_uncompletion_front(index);
			}
		}
		await this.repository.insert_uncompletion_front(this.repository.data.uncompletion_front.length, task);
		await this.repository.commit();
	}
	// Uncompletes the task with index `index` in the uncompletion front, assuming it exists. Mutates this model.
	async uncomplete(index) {
		let task = this.repository.data.uncompletion_front[index];
		let causes = Array.from(this.repository.data.completed.set.get_history(task).get_recent());
		let operation = Operation.create(task, this.repository.data.completed, false, causes);
		await this.repository.add_operation(operation);
		await this.repository.delete_uncompletion_front(index);
		for(let dependency of this.repository.data.registry.get_relation().get_preimage(task)) {
			if(this.repository.data.completed.set.is_max_not_definitely_out(dependency)) {
				await this.repository.insert_uncompletion_front(this.repository.data.uncompletion_front.length, dependency);
			}
		}
		for(let index = this.repository.data.completion_front.length - 1; index >= 0; index--) {
			let dependent = this.repository.data.completion_front[index];
			if(!this.repository.data.completed.set.is_min_not_definitely_in(dependent)) {
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
	// Update the completion and uncompletion fronts without committing. Mutates this model.
	async update() {
		while(this.repository.data.completion_front.length !== 0) {
			await this.repository.delete_completion_front(0);
		}
		while(this.repository.data.uncompletion_front.length !== 0) {
			await this.repository.delete_uncompletion_front(0);
		}
		for(let task of this.repository.data.completed.set.generate_min_not_definitely_in()) {
			await this.repository.insert_completion_front(this.repository.data.completion_front.length, task);
		}
		for(let task of this.repository.data.completed.set.generate_max_not_definitely_out()) {
			await this.repository.insert_uncompletion_front(this.repository.data.uncompletion_front.length, task);
		}
	}
	// Take tasks of the set given by `set` according to the synchronization protocol, reading lines through the asynchronous function `read` and writing lines through `write`. Mutates this model.
	async take(set, read, write) {
		while(await read() !== "stop") {
			let key = await read();
			if(this.repository.data.tasks.has(key)) {
				write("have");
			} else {
				write("haven't");
			}
		}
		while(await read() !== "stop") {
			let key = await read();
			let title = atob(await read());
			let description = atob(await read());
			let dependencies = [];
			let count = parseInt(await read());
			for(let i = 0; i < count; i++) {
				dependencies.push(this.repository.data.tasks.get(await read()));
			}
			await this.repository.register_task(new Task(key, title, description, dependencies));
		}
		let intersection_definitely_in = this.repository.data.registry.create();
		let union_not_definitely_out = this.repository.data.registry.create();
		for(let task of set.set.generate_max_definitely_in()) {
			intersection_definitely_in.add(task);
		}
		for(let task of set.set.generate_max_not_definitely_out()) {
			union_not_definitely_out.add(task);
		}
		while(await read() !== "stop") {
			let key = await read();
			if(this.repository.data.tasks.has(key)) {
				let task = this.repository.data.tasks.get(key);
				if(intersection_definitely_in.contains(task)) {
					intersection_definitely_in.remove(task);
				}
			}
		}
		while(await read() !== "stop") {
			let key = await read();
			let task = this.repository.data.tasks.get(key);
			if(!union_not_definitely_out.contains(task)) {
				union_not_definitely_out.add(task);
			}
		}
		outer: while(true) {
			for(let task of intersection_definitely_in.generate_min_out()) {
				if(union_not_definitely_out.contains(task)) {
					write("task");
					write(task.key);
					while(await read() !== "stop") {
						let key = await read();
						let is_in = parseInt(await read()) !== 0;
						let causes = [];
						let count = parseInt(await read());
						for(let i = 0; i < count; i++) {
							causes.push(this.repository.data.operations.get(await read()));
						}
						if(this.repository.data.operations.has(key)) {
							await this.repository.add_operation(this.repository.data.operations.get(key));
						} else {
							await this.repository.add_operation(new Operation(key, task, set, is_in, causes));
						}
					}
					intersection_definitely_in.add_min_out(task);
					continue outer;
				}
			}
			write("stop");
			break;
		}
		await this.update();
		await this.repository.commit();
	}
	// Give tasks of the set given by `set` according to the synchronization protocol, reading lines through the asynchronous function `read` and writing lines through `write`.
	async give(set, read, write) {
		let not_definitely_uncommon = this.repository.data.registry.create();
		let definitely_common = this.repository.data.registry.create();
		for(let task of set.set.generate_max_not_definitely_out()) {
			not_definitely_uncommon.add(task);
		}
		outer: while(true) {
			for(let task of not_definitely_uncommon.generate_max_in()) {
				if(!definitely_common.is_max_in(task)) {
					write("test");
					write(task.key);
					if(await read() === "have") {
						definitely_common.add(task);
					} else {
						not_definitely_uncommon.remove_max_in(task);
					}
					continue outer;
				}
			}
			write("stop");
			break;
		}
		let want = not_definitely_uncommon;
		let have = definitely_common;
		for(let task of set.set.generate_max_not_definitely_out()) {
			if(!want.contains(task)) {
				want.add(task);
			}
		}
		outer: while(true) {
			for(let task of have.generate_min_out()) {
				if(want.contains(task)) {
					write("task");
					write(task.key);
					write(btoa(task.title));
					write(btoa(task.description));
					write(task.dependencies.length.toString());
					for(let dependency of task.dependencies) {
						write(dependency.key);
					}
					have.add_min_out(task);
					continue outer;
				}
			}
			write("stop");
			break;
		}
		for(let task of set.set.generate_min_not_definitely_in()) {
			write("task");
			write(task.key);
		}
		write("stop");
		for(let task of set.set.generate_max_not_definitely_out()) {
			write("task");
			write(task.key);
		}
		write("stop");
		while(await read() !== "stop") {
			let key = await read();
			if(!this.repository.data.tasks.has(key)) {
				write("stop");
				continue;
			}
			let task = this.repository.data.tasks.get(key);
			for(let operation of set.set.get_history(task).get_operations()) {
				write("operation");
				write(operation.key);
				write(operation.is_in ? "1" : "0");
				write(operation.causes.length.toString());
				for(let cause of operation.causes) {
					write(cause.key);
				}
			}
			write("stop");
		}
	}
}
