class System {

	static get isServer () { return false }
	static get isClient () { return true }
}

module.exports = System;