import { Vector } from '../../helpers/Vector.js';
import { Utils } from '../../helpers/Utils.js';
import { Globals } from '../../helpers/Globals.js';
import { HashTable } from '../../helpers/HashSet.js';
import { InputUserFieldInteractions } from '../../core/interactions/InputUserFieldInteractions.js';

import { PhysicsComplex } from '../world-management/physics/PhysicsComplex.js';
import { Camera } from '../../core/world-management/scene/Camera.js';


import { World } from '../world-management/World.js';

export class Scene {
    constructor(g) {
        this.game = g;
        this.map = null;
        this.camera = null;
        this.inputUserInteractions = null;
        this.worlds = new HashTable();
        this.worldsNew = [];
        this.physicsComplex = new PhysicsComplex();
        this.canvas = Scene.getCanvas();

        if (Globals.getBoundaries()) {
            // this.createBoundaries();
        }
    }

    static getCanvas() {
        if (!this.canvas) {
            this.canvas = document.getElementById("gameCanvas");
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            });
        }
        return this.canvas;
    }

    createWorld(n) {
        this.worlds.set(n, new World(n, this.canvas));
    }

    addWorldObj(name, obj) {
        if (!this.worlds.get(name)) {
            return;
        }

        const w = this.worlds.get(name);
        w.addObject(obj);

        this.worlds.set(name, w);
    }

    getWorldObjs(name) {
        if (!this.worlds) {
            return [];
        }

        if (!this.worlds.get(name)) {
            return [];
        }

        return this.worlds.get(name).getObjects();
    }

    createUserInteractions() {
        if (!this.game) {
            console.error("Game instance is not defined.");
            return;
        }
        this.inputUserInteractions = InputUserFieldInteractions.enableInputModification(this.game);
    }

    createMap(mapGame) {
        this.map = mapGame;
    }

    createCamera() {
        this.camera = new Camera(this, 0, 0);
    }

    createBoundaries() {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let topBoundary = new Ground(this, 0, new Vector(0, 0), new Vector(canvasWidth, 0));
        let fixTop = new Fixture(topBoundary, 1);
        topBoundary.addFixture(fixTop);
        this.addWorldObj('main', topBoundary);

        let bottomBoundary = new Ground(this, 0, new Vector(0, canvasHeight), new Vector(canvasWidth, canvasHeight));
        let fixBottom = new Fixture(bottomBoundary, 1);
        bottomBoundary.addFixture(fixBottom);
        this.addWorldObj('main', bottomBoundary);

        let leftBoundary = new Ground(this, 0, new Vector(0, 0), new Vector(0, canvasHeight));
        let fixLeft = new Fixture(leftBoundary, 1);
        leftBoundary.addFixture(fixLeft);
        this.addWorldObj('main', leftBoundary);

        let rightBoundary = new Ground(this, 0, new Vector(canvasWidth, 0), new Vector(canvasWidth, canvasHeight));
        let fixRight = new Fixture(rightBoundary, 1);
        rightBoundary.addFixture(fixRight);
        this.addWorldObj('main', rightBoundary);
    }

    update(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.1);

        this.map.update(deltaTime);
        this.camera.update(deltaTime);

        for (let c of this.worlds.getAllObjects()) {
            c.update(deltaTime);
            c.verifyCollision(deltaTime);
        }

        if (eventshelper)
            eventshelper.resetLoop();
    }

    draw() {
        this.map.draw();

        for (let c of this.worlds.getAllObjects()) {
            c.draw();
        }
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