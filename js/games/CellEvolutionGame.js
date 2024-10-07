// games/CellEvolutionGame.js

class CellEvolutionGame extends Scene {
    constructor() {
        Globals.setBoundaries(false);
        Globals.setCollisions(true);
        Globals.setDebug(false);
        Globals.setGridSize(100);
        Globals.setGridVisible(false);

        super(CellEvolutionGame);

        let model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [6], units: 8, activation: 'relu'}));
        model.add(tf.layers.dense({units: 4, activation: 'relu'}));
        model.add(tf.layers.dense({units: 2, activation: 'tanh'}));
        model.compile({optimizer: 'adam', loss: 'meanSquaredError'});


        this.trainingManager = new TrainingManager();

        this.cells = [];
        this.foods = [];

        this.createWorld('main');

        const mainWorld = this.worlds.get('main');

        mainWorld.trainingManager = this.trainingManager;
        mainWorld.cells = this.cells;
        mainWorld.foods = this.foods;

        this.createMap();
        this.createCamera();
        this.createUserInteractions();
    }

    init() {
        this.addInitialCells();
        this.spawnInitialFood();
    }

    addInitialCells() {
        const initialCellCount = 50;
        for (let i = 0; i < initialCellCount; i++) {
            let x = Utils.randomInt(25, canvas.clientWidth - 50);
            let y = Utils.randomInt(15, 250);
            let size = Utils.randomInt(5, 15);
            let mass = size / 100 + Utils.randomInt(1, 5);

            var cell = new Cell(this.worlds.get('main'), this.trainingManager, {
                mass: mass,
                size: size,
                speed: 2
            });

            var fix = new Fixture(cell, 1);
            cell.addFixture(fix);

            this.addWorldObj('main', cell);
            this.cells.push(cell);
        }
    }
    spawnInitialFood() {
        const initialFoodCount = 200;
        for (let i = 0; i < initialFoodCount; i++) {
            let x = Utils.randomInt(25, canvas.clientWidth - 50);
            let y = Utils.randomInt(15, 250);
            let food = new Food(this.worlds.get('main'), new Vector(x, y));
            this.addWorldObj('main', food);
            this.foods.push(food);
        }
    }
    update(deltaTime) {
        super.update(deltaTime);

        if (this.foods.length < 500 && Math.random() < 0.02) {
            let x = Utils.randomInt(25, canvas.clientWidth - 50);
            let y = Utils.randomInt(15, 250);
            let food = new Food(this.worlds.get('main'), new Vector(x, y));
            this.addWorldObj('main', food);
            this.foods.push(food);
        }

        for (let cell of this.cells) {
            cell.update(deltaTime, this.worlds.get('main'));
        }

        for (let i = this.cells.length - 1; i >= 0; i--) {
            if (this.cells[i].isDead) {
                this.worlds.get('main').BODIES = this.worlds.get('main').BODIES.filter(obj => obj !== this.cells[i]);
                this.cells.splice(i, 1);
            }
        }
        this.trainingManager.update(deltaTime);
    }

    selectObjectFromMousePos(mousePos) {
        let inside = false;
        if (!(mousePos instanceof Vector)) {
            console.error("mousePos is not a valid Vector.");
            return;
        }

        for (let obj of this.getWorldObjs('main')) {
            if (Utils.existsMethod(obj.containsPoint) && obj.containsPoint(mousePos)) {
                this.selectedBody = obj;
                inside = true;
                if (Globals.isInputInteractions()) {
                    this.showInputs(obj);
                }
                break;
            }
        }

        if (!inside) {
            this.selectedBody = null;
            this.hideCellInfo();
        }
    }

    showInputs(obj) {
        if (obj && Utils.existsMethod(obj.getInputFieldsConfig)) {
            this.inputUserInteractions.bindDynamicObject(obj, 'Circle');
        }
    }

    hideCellInfo() {
        document.getElementById('infoPanel').style.display = 'none';
    }

    draw() {
        super.draw();

        this.drawStats();
    }

    drawStats() {
        const population = this.cells.length;
        const averageSize = population > 0 ? (this.cells.reduce((sum, cell) => sum + cell.size, 0) / population).toFixed(2) : 0;
        const fps = this.fps;

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Population: ${population}`, canvas.width - 150, 20);
        ctx.fillText(`Average Size: ${averageSize}`, canvas.width - 150, 40);
        ctx.fillText(`FPS: ${fps}`, canvas.width - 150, 60);
    }

    userInteractions() {
        const thatGame = this;

        canvas.addEventListener('click', function (e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
            const mousePos = new Vector(mouseX, mouseY);
            thatGame.selectObjectFromMousePos(mousePos);
        }, false);

    }

    resize() {
        game.setScreen();
    }
}
