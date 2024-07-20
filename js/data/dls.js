// data/mlss.js data/history.js

class DistributedLowerSet {
	// Constructs an empty set registered into the registry given by `registry`.
	constructor(registry) {
		this.registry = registry;
		this.histories = new Map();
		this.possibly_complete = new MaximumLowerSubset(registry);
		this.not_possibly_incomplete = new MinimumLowerSuperset(registry);
	}
	// Gets the history of a task as an immutable `History` valid until this set is mutated.
	get_history(task) {
		if(this.histories.has(task)) {
			return this.histories.get(task);
		} else {
			return new History();
		}
	}
	// Adds the operation given by `operation`.
	add_operation(operation) {
		let task = operation.el;
		if(!this.histories.has(task)) {
			this.histories.set(task, new History());
		}
		let history = this.histories.get(task);
		history.add(operation);
		let consensus = history.get_consensus();
		if(consensus === -1) {
			this.possibly_complete.remove(task);
			this.not_possibly_incomplete.remove(task);
		} else if(consensus === 1) {
			this.possibly_complete.add(task);
			this.not_possibly_incomplete.add(task);
		} else {
			this.possibly_complete.remove(task);
			this.not_possibly_incomplete.add(task);
		}
	}
	// Returns a boolean indicating if `el` is a definitely out element.
	is_definitely_out(el) {
		return !this.not_possibly_incomplete.get_minimum_lower_superset().contains(el);
	}
	// Returns a boolean indicating if `el` is a minimal not definitely in element.
	is_min_not_definitely_in(el) {
		return this.possibly_complete.get_maximum_lower_subset().is_min_out(el);
	}
	// Returns a boolean indicating if `el` is a maximal not definitely out element.
	is_max_not_definitely_out(el) {
		return this.not_possibly_incomplete.get_minimum_lower_superset().is_max_in(el);
	}
	// Returns an iterable yielding the maximal definitely in elements valid until this set is mutated.
	generate_max_definitely_in() {
		return this.possibly_complete.get_maximum_lower_subset().generate_max_in();
	}
	// Returns an iterable yielding the minimal not definitely in elements valid until this set is mutated.
	generate_min_not_definitely_in() {
		return this.possibly_complete.get_maximum_lower_subset().generate_min_out();
	}
	// Returns an iterable yielding the minimal not definitely out elements valid until this set is mutated.
	generate_max_not_definitely_out() {
		return this.not_possibly_incomplete.get_minimum_lower_superset().generate_max_in();
	}
}
