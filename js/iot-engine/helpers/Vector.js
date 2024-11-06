export class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vector(0, 0);
    }

    static $(x = 0, y = 0) {
        return new Vector(x, y);
    }

    isEmpty() {
        return (this.x == 0 && this.y == 0);
    }

    isNull() {
        return (this.x == null || this.y == null);
    }

    normalize() {
        const length = this.getLength();
        if (length == 0)
            return this;

        return new Vector(this.x / length, this.y / length);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    rotate(angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        return new Vector(this.x * cosA - this.y * sinA, this.x * sinA + this.y * cosA);
    }

    setX(value) {
        this.x = value;
    }

    getX() {
        return this.x;
    }

    setY(value) {
        this.y = value;
    }

    getY() {
        return this.y;
    }

    setAngle(angle) {
        var length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }


    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    headingRadian() {
        return Math.atan2(this.y, this.x);
    }

    heading() {
        var angle = this.getAngle();
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    getHeading(other) {
        return new Vector(Math.cos(other), Math.sin(other));
    }

    setHeading(angle) {
        let length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    setLength(length) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    length() {
        return this.getLength();
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    multiply(val) {
        return new Vector(this.x * val, this.y * val);
    }

    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    addTo(v2) {
        this.x += v2.x;
        this.y += v2.y;

        return this;
    }

    subtractFrom(v2) {
        this.x -= v2.x;
        this.y -= v2.y;

        return this;
    }

    multiplyBy(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    multiplyByVector(v) {
        var x = this.x * v.x;
        var y = this.y * v.y;

        return new Vector(x, y);
    }

    divideBy(val) {
        this.x /= val;
        this.y /= val;

        return this;
    }

    addVal(v) {
        return new Vector(this.x + v, this.y + v);
    }

    addValBy(v) {
        this.x += v;
        this.y += v;
        return this;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    distance(p1) {
        if (!p1 || !(p1 instanceof Vector)) {
            console.error("Invalid parameter passed to distance method.");
            return 0;
        }
        var dx = this.x - p1.x,
            dy = this.y - p1.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    angle(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    unit() {
        if (this.mag() === 0) {
            return new Vector(0, 0);
        } else {
            return new Vector(this.x / this.mag(), this.y / this.mag());
        }
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    setMag(mag) {
        let currentMag = this.getLength();
        if (currentMag !== 0) {
            this.x = (this.x / currentMag) * mag;
            this.y = (this.y / currentMag) * mag;
        } else {
            this.x = mag;
            this.y = 0;
        }
        return this;
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }

    drawVec(start_x, start_y, n, color) {
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    drawVec2(start_x, start_y, n, color, arrowsize = 4) {
        start_x = start_x == undefined ? this.x : start_x;
        start_y = start_y == undefined ? this.y : start_y;
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);

        let end_x = start_x + this.x * n;
        let end_y = start_y + this.y * n;
        ctx.lineTo(end_x, end_y);

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        ctx.stroke();

        let angle = Math.atan2(this.y, this.x);
        ctx.moveTo(end_x, end_y);
        ctx.lineTo(end_x - arrowsize * Math.cos(angle - Math.PI / 6), end_y - arrowsize * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end_x, end_y);
        ctx.lineTo(end_x - arrowsize * Math.cos(angle + Math.PI / 6), end_y - arrowsize * Math.sin(angle + Math.PI / 6));

        ctx.stroke();
        ctx.closePath();
    }

    normal() {
        return new Vector(-this.y, this.x);
    }
}
