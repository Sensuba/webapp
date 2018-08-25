import * as BABYLON from 'babylonjs';
import Tile from './Tile';
import node from '../Node';

export default class Field {

	constructor (parent, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.model = parent.model.field;
		this.id = this.model.id;
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

        this.obj = node.create("field", this.parent.obj);

        this.tiles = [];
        [-6, -2, 2, 6].forEach((n, i) => this.tiles.push(new Tile(this, this.model.tiles[i], new BABYLON.Vector3(n, 0.01, 2.5), new BABYLON.Vector3(0, 0, 0))));
        [-8, -4, 0, 4, 8].forEach((n, i) => this.tiles.push(new Tile(this, this.model.tiles[i+4], new BABYLON.Vector3(n, 0.01, -2.5), new BABYLON.Vector3(0, 0, 0))));
	}
}