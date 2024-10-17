import {Engine} from './iot-engine/core/Engine.js';
import {Interactions} from './iot-engine/core/interactions/Interections.js';
// import {CellEvolutionGame} from './games/CellEvolutionGame.js';
import {RocketFakeGameImp as GameMain} from './games/GameOldPlaye2r.js';
let canvas = null;
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const eventshelper = new Interactions(canvas);

    const game = new Engine(new GameMain());
    game.init();
});
