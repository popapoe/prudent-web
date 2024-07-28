// data/relation.js

// A lower set registry.
class LowerSetRegistry {
	// Constructs an empty registry.
	constructor() {
		this.relation = new Relation();
		this.min = new Set();
		this.max = new Set();
		this.sets = new Set();
	}
	// Returns the relation of this registry as an immutable `Relation` valid until this registry is mutated.
	get_relation() {
		return this.relation;
	}
	// Returns the maximal elements of this registry as a `Set` valid until this registry is mutated.
	get_max() {
		return this.max;
	}
	// Adds `el` to every lower set. Mutates this registry.
	add(el) {
		this.min.add(el);
		this.max.add(el);
		for(let reference of this.sets) {
			let set = reference.deref();
			if(set === undefined) {
				this.sets.delete(reference);
			} else {
				set.out_min.add(el);
			}
		}
	}
	// Removes `el` from every lower set, assuming it has no relationships. Mutates this registry.
	remove(el) {
		this.min.delete(el);
		this.max.delete(el);
		for(let reference of this.sets) {
			let set = reference.deref();
			if(set === undefined) {
				this.sets.delete(reference);
			} else {
				set.in_max.delete(el);
				set.out_min.delete(el);
			}
		}
	}
	// Relates `from` to `to` in every lower set. Mutates this registry.
	add_relationship(from, to) {
		this.min.delete(to);
		this.max.delete(from);
		for(let reference of this.sets) {
			let set = reference.deref();
			if(set === undefined) {
				this.sets.delete(reference);
			} else {
				if(set.contains(to)) {
					set.add(from);
				} else if(set.contains(from)) {
					set.cross.add(from, to);
				}
				set.in_max.delete(from);
				set.out_min.delete(to);
			}
		}
		this.relation.add(from, to);
	}
	// Removes the relationship between `from` and `to` in every lower set. Mutates this registry.
	remove_relationship(from, to) {
		let is_from_max = this.relation.get_image(from).size === 1;
		let is_to_min = this.relation.get_preimage(to).size === 1;
		if(is_from_max) {
			this.max.add(from);
		}
		if(is_to_min) {
			this.min.add(to);
		}
		for(let reference of this.sets) {
			let set = reference.deref();
			if(set === undefined) {
				this.sets.delete(reference)
			} else {
				let is_from_in = set.contains(from);
				let is_to_in = set.contains(to);
				let cross = set.cross.get_image(from).has(to);
				if(is_from_max && is_from_in) {
					set.in_max.add(from);
				}
				if(is_to_min && !is_to_in) {
					set.out_min.add(to);
				}
				if(cross) {
					set.cross.remove(from, to);
				}
			}
		}
		this.relation.remove(from, to);
	}
	// Return a registered lower set. Mutates this registry.
	create() {
		let set = new LowerSet(this.relation, new Set(this.min));
		this.sets.add(new WeakRef(set));
		return set;
	}
}

// A mutable lower set.
class LowerSet {
	// Constructs an empty lower subset of the upper closure of `min` ordered by the transitive closure of `relation` valid until either `min` or `relation` is mutated. Mutates `min`.
	constructor(relation, min) {
		this.relation = relation;
		this.out_min = min;
		this.in_max = new Set();
		this.cross = new Relation();
	}
	// Returns a boolean indicating if `el` is an in element.
	contains(el) {
		if(this.out_min.has(el)) {
			return false;
		}
		while(true) {
			if(this.cross.get_image(el).size !== 0) {
				return true;
			}
			let successors = this.relation.get_image(el);
			if(successors.size === 0) {
				return this.in_max.has(el);
			}
			for(el of successors) {
				break;
			}
		}
	}
	// Adds `el`, assuming it is a minimal out element. Mutates this lower set.
	add_min_out(el) {
		for(let pred of this.relation.get_preimage(el)) {
			this.cross.remove(pred, el);
		}
		for(let succ of this.relation.get_image(el)) {
			this.cross.add(el, succ);
		}
		if(this.relation.get_image(el).size === 0) {
			this.in_max.add(el);
		}
		if(this.relation.get_preimage(el).size === 0) {
			this.out_min.delete(el);
		}
	}
	// Removes `el`, assuming it is a maximal in element. Mutates this lower set.
	remove_max_in(el) {
		for(let pred of this.relation.get_preimage(el)) {
			this.cross.add(pred, el);
		}
		for(let succ of this.relation.get_image(el)) {
			this.cross.remove(el, succ);
		}
		if(this.relation.get_image(el).size === 0) {
			this.in_max.delete(el);
		}
		if(this.relation.get_preimage(el).size === 0) {
			this.out_min.add(el);
		}
	}
	// Adds `el`, assuming it is an out element. Mutates this lower set.
	add(el) {
		while(!this.is_min_out(el)) {
			let pred;
			for(pred of this.generate_out_pred(el)) {
				break;
			}
			this.add(pred);
		}
		this.add_min_out(el);
	}
	// Removes `el`, assuming it is an in element. Mutates this lower set.
	remove(el) {
		while(!this.is_max_in(el)) {
			let succ;
			for(succ of this.generate_in_succ(el)) {
				break;
			}
			this.remove(succ);
		}
		this.remove_max_in(el);
	}
	// Returns a boolean indicating if `el` is a minimal out element.
	is_min_out(el) {
		let predecessors = this.relation.get_preimage(el);
		if(predecessors.size === 0) {
			return this.out_min.has(el);
		} else {
			return predecessors.size === this.cross.get_preimage(el).size;
		}
	}
	// Returns a boolean indicating if `el` is a maximal in element.
	is_max_in(el) {
		let successors = this.relation.get_image(el);
		if(successors.size === 0) {
			return this.in_max.has(el);
		} else {
			return successors.size === this.cross.get_image(el).size;
		}
	}
	// Returns an iterable yielding the minimal out elements valid until this lower set is mutated.
	* generate_min_out(el) {
		yield* this.out_min;
		for(let el of this.cross.generate_range()) {
			if(this.is_min_out(el)) {
				yield el;
			}
		}
	}
	// Returns an iterable yielding the maximal in elements valid until this lower set is mutated.
	* generate_max_in(el) {
		yield* this.in_max;
		for(let el of this.cross.generate_domain()) {
			if(this.is_max_in(el)) {
				yield el;
			}
		}
	}
	// Returns an iterable yielding the in successors of `el` valid until this lower set is mutated, assuming `el` is in.
	* generate_in_succ(el) {
		for(let succ of this.relation.get_image(el)) {
			if(!this.cross.get_image(el).has(succ)) {
				yield succ;
			}
		}
	}
	// Returns an iterable yielding the in successors of `el` valid until this lower set is mutated, assuming `el` is out.
	* generate_out_pred(el) {
		for(let pred of this.relation.get_preimage(el)) {
			if(!this.cross.get_preimage(el).has(pred)) {
				yield pred;
			}
		}
	}
}
