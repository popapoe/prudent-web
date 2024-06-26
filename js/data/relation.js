// A mutable binary relation that supports "get image" and "get domain of definition" queries.
class Images {
	// Constructs an empty relation.
	constructor() {
		this.images = new Map();
	}
	// Adds a relationship, assuming it is not present. Mutates this relation.
	add(from, to) {
		if(!this.images.has(from)) {
			this.images.set(from, new Set());
		}
		this.images.get(from).add(to);
	}
	// Removes a relationship, assuming it is present. Mutates this relation.
	remove(from, to) {
		this.images.get(from).delete(to);
		if(this.images.get(from).size === 0) {
			this.images.delete(from);
		}
	}
	// Gets the image of a value as an immutable `Set` valid until this relation is mutated.
	get_image(from) {
		if(this.images.has(from)) {
			return this.images.get(from);
		} else {
			return new Set();
		}
	}
	// Returns an iterable yielding the values with a non-empty image valid until this relation is mutated.
	generate_domain() {
		return this.images.keys();
	}
}

// A mutable binary relation that supports "get image," "get preimage," "get domain of definition," and "get range" queries.
class Relation {
	// Constructs an empty relation.
	constructor() {
		this.forward = new Images();
		this.backward = new Images();
	}
	// Adds a relationship, assuming it is not present. Mutates this relation.
	add(from, to) {
		this.forward.add(from, to);
		this.backward.add(to, from);
	}
	// Removes a relationship, assuming it is present. Mutates this relation.
	remove(from, to) {
		this.forward.remove(from, to);
		this.backward.remove(to, from);
	}
	// Gets the image of a value as an immutable `Set` valid until this relation is mutated.
	get_image(from) {
		return this.forward.get_image(from);
	}
	// Gets the preimage of a value as an immutable `Set` valid until this relation is mutated.
	get_preimage(to) {
		return this.backward.get_image(to);
	}
	// Returns an iterable yielding the values with a non-empty image valid until this relation is mutated.
	generate_domain() {
		return this.forward.generate_domain();
	}
	// Returns an iterable yielding the values with a non-empty preimage valid until this relation is mutated.
	generate_range() {
		return this.backward.generate_domain();
	}
}
