import { Vector } from '../../../helpers/Vector.js';
import { Sprite } from './Sprites.js';
import { ImageHelper } from '../../../helpers/ImageHelper.js'; // Adjust the path as necessary
import { Globals } from '../../../helpers/Globals.js'; // Add this import
import { Fixture } from '../../../core/world-management/physics/helpers/Fixture.js';
import { Grid } from './Grid.js';
import { Scene } from '../Scene.js'; 

export class Boundary {
  constructor(pos, w, h) {
    this.pos = pos;
    this.width = w;
    this.height = h;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.pos.getX(), this.pos.getX(), this.w, this.h);
  }
}

const background = new Sprite({
  position: new Vector(0, 0),
  velocity: null,
  image: new ImageHelper('../images/background_p1.png')
});

export class MapGame extends Scene {
  constructor(rocket) {
    super(); // Call the parent constructor
    this.rocket = rocket;
    this.load = false;
    this.gridEnabled = Globals.isGridVisible();
    this.grid = new Grid(this.getCanvas().width, this.getCanvas().height, Globals.getGridSize());
  }

  toggleGrid() {
    this.gridEnabled = !this.gridEnabled;
    this.grid.toggleVisibility();
  }

  update(deltaTime) {
  }

  draw() {
    let camera = this.rocket.camera;
    background.position.x += camera.position.getX();

    background.draw();

    if (this.gridEnabled) {
      this.grid.draw(ctx);
    }
  }
}