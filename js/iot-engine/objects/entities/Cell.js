import { BodyDef } from './../bodies/BodyDef';
export class Cell extends BodyDef {
    constructor(world, trainingManager, traits = {}) {
        super(world, traits.mass || 1, traits.position || new Vector(Math.random() * canvas.width, Math.random() * canvas.height));

        this.size = traits.size || 10;
        this.life = this.size;
        this.age = 0;
        this.isDead = false;

        this.traits = { ...traits };
        this.mutateTraits();

        this.color = this.assignColor();
        this.brain = traits.brain ? traits.brain.clone() : new SimpleBrain();

        this.heading = Math.random() * Math.PI * 2;
        this.speed = traits.speed || 2;
        this.reproductionCooldown = 0;

        trainingManager.registerCell(this);
    }

    mutateTraits() {
        const mutationRate = 0.05;
        for (let trait in this.traits) {
            if (Math.random() < mutationRate) {
                this.traits[trait] *= (1 + (Math.random() * 0.2 - 0.1));
            }
        }
    }

    assignColor() {
        const colors = ['cyan', 'magenta', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(deltaTime, world) {
        if (this.isDead) return;

        this.age += deltaTime;
        this.life -= deltaTime * 0.1;

        if (!Array.isArray(this.instance.foods)) {
            console.error("this.instance.foods is not defined or not an array.");
            this.instance.foods = [];
        }

        if (!Array.isArray(this.instance.cells)) {
            console.error("this.instance.cells is not defined or not an array.");
            this.instance.cells = [];
        }

        const inputs = this.getInputs(world);
        const [turning, acceleration] = this.brain.decide(inputs);

        this.heading += turning * 0.1;

        this.speed += acceleration * 0.05;
        this.speed = Math.max(0.5, Math.min(this.speed, 5));

        this.position.x += Math.cos(this.heading) * this.speed * deltaTime;
        this.position.y += Math.sin(this.heading) * this.speed * deltaTime;

        this.position.x = (this.position.x + canvas.width) % canvas.width;
        this.position.y = (this.position.y + canvas.height) % canvas.height;

        for (let i = this.instance.foods.length - 1; i >= 0; i--) {
            const food = this.instance.foods[i];
            const dist = this.position.distance(food.position);
            if (dist < this.size + food.size) {
                this.eat(food);
                this.instance.foods.splice(i, 1);
                this.brain.addTrainingData(inputs, [turning, acceleration]);
            }
        }

        for (let other of this.instance.cells) {
            if (other === this || other.isDead) continue;
            const dist = this.position.distance(other.position);
            if (dist < this.size + other.size) {
                if (this.size > other.size * 1.2) {
                    this.eat(other);
                    other.isDead = true;
                    this.brain.addTrainingData(inputs, [turning, acceleration]);
                } else if (other.size > this.size * 1.2) {
                    other.eat(this);
                    this.isDead = true;
                    other.brain.addTrainingData(inputs, [turning, acceleration]);
                }
            }
        }

        // Reproduction
        if (this.age > 1000 && this.reproductionCooldown <= 0 && this.instance.cells.length < this.instance.maxPopulation) {
            this.reproduce(world);
            this.reproductionCooldown = 500;
        }

        if (this.life <= 0 || this.age >= 2000) {
            this.isDead = true;
            this.instance.trainingManager.unregisterCell(this);
        }

        this.reproductionCooldown -= deltaTime;
    }

    getInputs(world) {
        let closestFood = null;
        let minFoodDist = this.instance.detectionRange || 200;
        for (let food of this.instance.foods) {
            const dist = this.position.distance(food.position);
            if (dist < minFoodDist) {
                minFoodDist = dist;
                closestFood = food;
            }
        }

        let closestCell = null;
        let minCellDist = this.instance.detectionRange || 200;
        for (let cell of this.instance.cells) {
            if (cell === this || cell.isDead) continue;
            const dist = this.position.distance(cell.position);
            if (dist < minCellDist) {
                minCellDist = dist;
                closestCell = cell;
            }
        }

        const normFoodDist = closestFood ? minFoodDist / (this.instance.detectionRange || 200) : 1;
        const normCellDist = closestCell ? minCellDist / (this.instance.detectionRange || 200) : 1;

        let angleToFood = 0;
        if (closestFood) {
            angleToFood = Math.atan2(closestFood.position.y - this.position.y, closestFood.position.x - this.position.x) - this.heading;
            angleToFood = ((angleToFood + Math.PI) % (2 * Math.PI)) - Math.PI;
            angleToFood /= Math.PI;
        }

        let angleToCell = 0;
        let sizeRatio = 1;
        if (closestCell) {
            angleToCell = Math.atan2(closestCell.position.y - this.position.y, closestCell.position.x - this.position.x) - this.heading;
            angleToCell = ((angleToCell + Math.PI) % (2 * Math.PI)) - Math.PI;
            angleToCell /= Math.PI;
            sizeRatio = closestCell.size / this.size;
        }

        const lifeLevel = this.life / this.size;

        return [normFoodDist, angleToFood, normCellDist, angleToCell, sizeRatio, lifeLevel];
    }

    eat(entity) {
        if (entity instanceof Food) {
            this.life += 5;
            this.size += 0.5;
        } else if (entity instanceof Cell) {
            this.life += entity.size * 0.5;
            this.size += entity.size * 0.5;
        }
    }

    reproduce(world) {
        const offspring = new Cell(world, this.instance.trainingManager, {
            mass: this.mass * 0.5,
            size: this.size * 0.5,
            speed: this.speed,
            brain: this.brain.clone()
        });
        this.size *= 0.5;
        this.life *= 0.5;
        this.instance.cells.push(offspring);
        this.instance.addObject(offspring);
    }

    draw() {
        if (this.isDead) return;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(
            this.position.x + Math.cos(this.heading) * this.size * 2,
            this.position.y + Math.sin(this.heading) * this.size * 2
        );
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x - this.size, this.position.y - this.size - 10, (this.life / this.size) * (this.size * 2), 5);
    }
}
