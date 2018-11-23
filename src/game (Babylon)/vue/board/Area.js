import * as BABYLON from 'babylonjs';
import Hand from './Hand';
import Deck from './Deck';
import Field from './Field';
import Court from './Court';

export default class Area {

	constructor (parent, model, position, rotation) {

		this.parent = parent;
		this.scene = parent.scene;
		this.model = model;
		this.id = model.id;
		this.scene.manager.addItem(this);
		this.mount();
		this.obj.position = position;
		this.obj.rotation = rotation;
	}

	mount () {

      var board = BABYLON.Mesh.CreateGround("gameboard", 30, 12, 2, this.scene);
      this.obj = board;

      var materialSphere2 = new BABYLON.StandardMaterial("texture2", this.scene);
	  materialSphere2.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	  board.material = materialSphere2;

      //new Card(this.scene, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0)).move(new BABYLON.Vector3(0, 5, 0), new BABYLON.Vector3(-1, 0, 0));

      this.hand = new Hand(this, new BABYLON.Vector3(0, 4, -8), new BABYLON.Vector3(-0.8, 0, 0));
      this.deck = new Deck(this, new BABYLON.Vector3(12, 0.5, 0), new BABYLON.Vector3(0, 0, 0));
      this.field = new Field(this, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0));
      this.court = new Court(this, new BABYLON.Vector3(-3, 24, -14), new BABYLON.Vector3(-0.8, 0, 0));
      //var c = new Card(this, new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, 0, 0));
	}
}