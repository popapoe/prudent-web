// A mutable lower set with a naïve implementation.
class LowerSetNaive {
	// Constructs an empty lower subset of the upper closure of `min` ordered by the transitive closure of `relation` valid until `relation` is mutated.
	constructor(relation, min) {
		this.relation = relation;
		this.in = new Set();
		this.out = new Set();
		let stack = [];
		for(let el of min) {
			stack.push(el);
		}
		while(stack.length !== 0) {
			let el = stack.pop();
			if(!this.out.has(el)) {
				this.out.add(el);
				for(let succ of relation.get_image(el)) {
					stack.push(succ);
				}
			}
		};
	}
	// Returns a boolean indicating if `el` is an in element.
	contains(el) {
		return this.in.has(el);
	}
	// Adds `el`, assuming it is a minimal out element. Mutates this lower set.
	add_min_out(el) {
		this.in.add(el);
		this.out.delete(el);
	}
	// Removes `el`, assuming it is a maximal in element. Mutates this lower set.
	remove_max_in(el) {
		this.in.delete(el);
		this.out.add(el);
	}
	// Returns a boolean indicating if `el` is a minimal out element.
	is_min_out(el) {
		if(this.in.has(el)) {
			return false;
		}
		for(let pred of this.relation.get_preimage(el)) {
			if(this.out.has(pred)) {
				return false;
			}
		}
		return true;
	}
	// Returns a boolean indicating if `el` is a maximal in element.
	is_max_in(el) {
		if(this.out.has(el)) {
			return false;
		}
		for(let succ of this.relation.get_image(el)) {
			if(this.in.has(succ)) {
				return false;
			}
		}
		return true;
	}
	// Returns an iterable yielding the minimal out elements valid until this lower set is mutated.
	* generate_min_out(el) {
		for(let el of this.out) {
			if(this.is_min_out(el)) {
				yield el;
			}
		}
	}
	// Returns an iterable yielding the maximal in elements valid until this lower set is mutated.
	* generate_max_in(el) {
		for(let el of this.in) {
			if(this.is_max_in(el)) {
				yield el;
			}
		}
	}
	// Returns an iterable yielding the in successors of `el` valid until this lower set is mutated, assuming `el` is in.
	* generate_in_succ(el) {
		for(let succ of this.relation.get_image(el)) {
			if(this.in.has(succ)) {
				yield succ;
			}
		}
	}
	// Returns an iterable yielding the in successors of `el` valid until this lower set is mutated, assuming `el` is out.
	* generate_out_pred(el) {
		for(let pred of this.relation.get_preimage(el)) {
			if(this.out.has(pred)) {
				yield pred;
			}
		}
	}
}
