class Switcher {
	constructor() {
		this.root = document.createElement("div");
		this.inner = null;
	}
	get_root() {
		return this.root;
	}
	switch(next) {
		if(this.inner !== null) {
			this.root.removeChild(this.inner);
		}
		this.inner = next;
		if(this.inner !== null) {
			this.root.appendChild(this.inner);
		}
	}
}
