import { Scene } from '../iot-engine/core/world-management/Scene.js';
import { Utils } from '../iot-engine/helpers/Utils.js';
import { Ball } from '../iot-engine/objects/entities/Ball.js'; // Ensure this path is correct
import { Fixture } from '../iot-engine/objects/entities/Fixture.js'; // Ensure this path is correct
import { Ground } from '../iot-engine/objects/entities/Ground.js'; // Ensure this path is correct

export class GameSimpleBalls extends Scene {
    constructor() {
        super(GameSimpleBalls);
        this.selectedBody = null;
        this.createWorld('main');
        this.createMap();
        this.createCamera();
        this.createUserInteractions();
    }

    addObjects() {
        const canvas = Scene.getCanvas(); // Use the static method to get the canvas
        for (let i = 0; i < 500; i++) {
            let x0 = Utils.randomInt(25, canvas.clientWidth - 50);
            let y0 = Utils.randomInt(15, 250);
            let x1 = x0 + Utils.randomInt(-0, 50);
            let y1 = y0 + Utils.randomInt(-0, 50);
            let w = Utils.randomInt(1, 15);
            let m = w / 100 + Utils.randomInt(1, 5);

            var ball = new Ball(this, m, w, new Vector(x0, y0));
            var fixPol2 = new Fixture(ball, 1);
            ball.addFixture(fixPol2);
            this.addWorldObj('main', ball);
        }

        let ground = new Ground(this, 0, new Vector(200, canvas.clientHeight / 3), new Vector(canvas.clientWidth - 200, canvas.clientHeight - 300));
        var fixGround = new Fixture(ground, 1);
        ground.addFixture(fixGround);
        this.addWorldObj('main', ground);
    }
}
