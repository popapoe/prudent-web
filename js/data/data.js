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
	// Registers `task` as an incomplete task. Mutates this database.
	register_task(task) {
		this.registry.add(task);
		for(let dependency of task.dependencies) {
			this.registry.add_relationship(dependency, task);
		}
	}
	// Returns a snapshot of the state of the database `data`.
	static save(data) {
		let snapshot = {
			tasks: [],
			completion_front_keys: [],
			uncompletion_front_keys: [],
		};
		let saved_tasks = data.registry.create();
		while(true) {
			let iterator = saved_tasks.generate_min_out()[Symbol.iterator]();
			let iterator_result = iterator.next();
			if(iterator_result.done) {
				break;
			}
			let task = iterator_result.value;
			let dependency_keys = [];
			for(let dependency of task.dependencies) {
				dependency_keys.push(dependency.key);
			}
			saved_tasks.add_min_out(task);
			snapshot.tasks.push({
				key: task.key,
				title: task.title,
				description: task.description,
				dependency_keys: dependency_keys,
			});
		}
		for(let task of data.completion_front) {
			snapshot.completion_front_keys.push(task.key);
		}
		for(let task of data.uncompletion_front) {
			snapshot.uncompletion_front_keys.push(task.key);
		}
		return snapshot;
	}
	// Returns a database restored from the snapshot `snapshot`.
	static restore(snapshot) {
		let data = new Data();
		let tasks = new Map();
		for(let task_data of snapshot.tasks) {
			let dependencies = [];
			for(let dependency_key of task_data.dependency_keys) {
				dependencies.push(tasks.get(dependency_key));
			}
			let task = new Task(task_data.key, task_data.title, task_data.description, dependencies);
			tasks.set(task_data.key, task);
			data.register_task(task);
		}
		for(let key of snapshot.completion_front_keys) {
			data.completion_front.push(tasks.get(key));
		}
		for(let key of snapshot.uncompletion_front_keys) {
			let task = tasks.get(key);
			data.uncompletion_front.push(task);
			data.completed.add(task);
		}
		return data;
	}
}
