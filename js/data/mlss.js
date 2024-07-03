// A mutable set that supports "maximum lower subset" queries.
class MaximumLowerSubset {
	// Constructs an empty set registered into the registry given by `registry`.
	constructor(registry) {
		this.registry = registry;
		this.subset = registry.create();
		this.in = new Set();
	}
	// Returns a boolean indicating if `el` is an in element.
	contains(el) {
		return this.in.has(el) || this.subset.contains(el);
	}
	// Returns the maximum lower subset of this set as an immutable `LowerSet` valid until this set is mutated.
	get_maximum_lower_subset() {
		return this.subset;
	}
	// Adds `el` to this set, assuming it is an out element. Mutates this set.
	add(el) {
		if(this.subset.is_min_out(el)) {
			this.subset.add_min_out(el);
			for(let succ of this.registry.get_relation().get_image(el)) {
				if(this.in.has(succ)) {
					this.in.delete(succ);
					this.add(succ);
				}
			}
		} else {
			this.in.add(el);
		}
	}
	// Removes `el` from this set, assuming it is an in element. Mutates this set.
	remove(el) {
		if(!this.in.has(el)) {
			this.move_in(el);
		}
		this.in.delete(el);
	}
	move_in(el) {
		while(!this.subset.is_max_in(el)) {
			let succ;
			for(succ of this.subset.generate_in_succ(el)) {
				break;
			}
			this.move_in(succ);
		}
		this.subset.remove_max_in(el);
		this.in.add(el);
	}
}

// A mutable lower set that supports "minimum lower superset" queries.
class MinimumLowerSuperset {
	// Constructs an empty set registered into the registry given by `registry`.
	constructor(registry) {
		this.registry = registry;
		this.superset = registry.create();
		this.out = new Set();
	}
	// Returns a boolean indicating if `el` is an in element.
	contains(el) {
		return !this.out.has(el) && this.superset.contains(el);
	}
	// Returns the minimum lower superset of this set as an immutable `LowerSet` valid until this set is mutated.
	get_minimum_lower_superset() {
		return this.superset;
	}
	// Adds `el` to this set, assuming it is an out element. Mutates this set.
	add(el) {
		if(!this.out.has(el)) {
			this.move_out(el);
		}
		this.out.delete(el);
	}
	// Removes `el` from this set, assuming it is an in element. Mutates this set.
	remove(el) {
		if(this.superset.is_max_in(el)) {
			this.superset.remove_max_in(el);
			for(let pred of this.registry.get_relation().get_preimage(el)) {
				if(this.out.has(pred)) {
					this.out.delete(pred);
					this.remove(pred);
				}
			}
		} else {
			this.out.add(el);
		}
	}
	move_out(el) {
		while(!this.superset.is_min_out(el)) {
			let pred;
			for(pred of this.superset.generate_out_pred(el)) {
				break;
			}
			this.move_out(pred);
		}
		this.superset.add_min_out(el);
		this.out.add(el);
	}
}
