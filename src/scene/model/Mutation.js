class Mutation {

	constructor (src, effect, priority) {
		
		this.src = src;
		this.effect = effect;
		this.priority = priority;
		if (src.activated)
			this.activate();
	}

	activate () {

		if (this.activated)
			return;
		this.src.mutations = this.src.mutations || [];
		this.src.mutations.push(this);
		this.activated = true;
	}

	deactivate () {

		if (!this.activated)
			return;
		this.src.mutations = this.src.mutations.filter (m => m !== this);
	}

	apply (target) {

		return this.effect(target);
	}
}

module.exports = Mutation;