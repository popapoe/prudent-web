class History {
	// Constructs an empty history.
	constructor() {
		this.operations = new Set();
		this.recent = new Set();
	}
	// Returns the set of operations as an immutable `Set` valid until this history is mutated.
	get_operations() {
		return this.operations;
	}
	// Returns the set of recent operations as an immutable `Set` valid until this history is mutated.
	get_recent() {
		return this.recent;
	}
	// Adds the operation given by `operation`. Mutates this history.
	add(operation) {
		if(!this.operations.has(operation)) {
			this.operations.add(operation);
			for(let pred of operation.causes) {
				this.recent.delete(pred);
			}
			this.recent.add(operation);
		}
	}
	// Returns an integer indicating the state of consensus of this history. If the consensus is of being in, the integer is 1; if the consensus is of being out, the integer is -1; otherwise, there is no consensus and the integer is 0.
	get_consensus() {
		let all_in = true;
		let all_out = true;
		for(let operation of this.recent) {
			if(operation.is_in) {
				all_out = false;
			} else {
				all_in = false;
			}
		}
		if(all_out) {
			return -1;
		} else if(all_in) {
			return 1;
		} else {
			return 0;
		}
	}
}
