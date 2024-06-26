// data/relation.js

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
