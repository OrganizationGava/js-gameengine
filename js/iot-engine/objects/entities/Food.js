class Food extends BodyDef {
    constructor(world, position = null) {
        const pos = position || new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        super(world, 0, pos); // mass = 0 for static objects

        this.size = 3;
        this.color = 'lime';
    }

    update(deltaTime, world) {
        // Food does not need to update
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
