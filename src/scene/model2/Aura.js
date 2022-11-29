class Aura {

	constructor (src, mutation, area, targets) {
		
		this.src = src;
		this.mutation = mutation;
		this.area = area;
		this.targets = targets;
		this.activated = false;
		if (src.activated)
			this.activate();
	}

	activate () {

		if (this.activated)
			return;
		this.src.game.addAura(this);
		this.activated = true;
	}

	deactivate () {

		if (!this.activated)
			return;
		this.src.game.clearAura(this);
		this.activated = false;
	}

	applicable (target, player) {

		let targets = this.targets(this.src);
		return (!targets || targets(this.src, target)) && this.area(this.src).includes(target.location);
	}

	apply (target) {

		return this.mutation(this.src, target);
	}

	copy (src) {

		return new Aura(src, this.mutation, this.area, this.targets);
	}
}

module.exports = Aura;