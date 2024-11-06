import { Scene } from '../../../core/world-management/Scene.js';
import { Vector } from '../../../helpers/Vector.js';
import { BasicForms } from '../../../Shared.js';

export default class Circle extends BasicForms {
    constructor(position, radius) {
        super();

        this.position = position instanceof Vector ? position : new Vector(position?.x, position?.y); 
        this.radius = radius;
        
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "black";

        this.velocity = undefined;
        this.acceleration = undefined;
        this.acc = undefined;
    }

    draw() {
        if( this.position == undefined || this.position.getX() == undefined)
            return ;

        this.ctx.beginPath();
        this.ctx.arc(this.position.getX(), this.position.getY(), this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawVector(v, x, y, col, factor = 1) {
        this.ctx.save();
        let arrowsize = 4;

        this.ctx.translate(x, y);
        this.ctx.strokeStyle = col;

        let angle = Math.atan2(v.y, v.x);
        this.ctx.rotate(angle);

        let len = v.mag() * factor;

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(len, 0);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(len, 0);
        this.ctx.lineTo(len - arrowsize, arrowsize / 2);
        this.ctx.moveTo(len, 0);
        this.ctx.lineTo(len - arrowsize, -arrowsize / 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    debug() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "14px Arial bold";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";

        this.ctx.fillText("Direct X: " + this.position.getX() + " y: " + this.position.getY(), this.position.getX() - 70, this.position.getY() - this.radius - 30);

        // ctx.fillText("Accele:" + this.acceleration.getLength() + " | Thottle:" + this.rocketFake.throttle + " Force:" + this.forceCalculated, this.position.getX() - 50, this.position.getY() - this.radius - 30);
        this.ctx.closePath();
    }

}
