// data/lower-set.js data/dls.js

// An in-memory database.
class Data {
	// Constructs an empty database.
	constructor() {
		this.tasks = new Map();
		this.operations = new Map();
		this.registry = new LowerSetRegistry();
		this.completed = new DistributedLowerSet(this.registry);
		this.completion_front = [];
		this.uncompletion_front = [];
	}
	// Registers `task` as an incomplete task. Mutates this database.
	register_task(task) {
		this.registry.add(task);
		for(let dependency of task.dependencies) {
			this.registry.add_relationship(dependency, task);
		}
		this.tasks.set(task.key, task);
	}
	// Returns a snapshot of the state of the database `data`.
	static save(data) {
		let snapshot = {
			tasks: [],
			operations: [],
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
			for(let operation of data.completed.get_history(task).get_operations()) {
				let cause_keys = [];
				for(let cause of operation.causes) {
					cause_keys.push(cause.key);
				}
				snapshot.operations.push({
					key: operation.key,
					task_key: operation.el.key,
					is_in: operation.is_in,
					cause_keys: cause_keys,
				});
			}
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
		for(let task_data of snapshot.tasks) {
			let dependencies = [];
			for(let dependency_key of task_data.dependency_keys) {
				dependencies.push(data.tasks.get(dependency_key));
			}
			let task = new Task(task_data.key, task_data.title, task_data.description, dependencies);
			data.tasks.set(task_data.key, task);
			data.register_task(task);
		}
		for(let operation_data of snapshot.operations) {
			let causes = [];
			for(let cause_key of operation_data.cause_keys) {
				causes.push(data.operations.get(cause_key));
			}
			let task = data.tasks.get(operation_data.task_key);
			let operation = new Operation(operation_data.key, task, operation_data.is_in, causes);
			data.operations.set(operation_data.key, operation);
			data.completed.add_operation(operation);
		}
		for(let key of snapshot.completion_front_keys) {
			data.completion_front.push(data.tasks.get(key));
		}
		for(let key of snapshot.uncompletion_front_keys) {
			data.uncompletion_front.push(data.tasks.get(key));
		}
		return data;
	}
}
