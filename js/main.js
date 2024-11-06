import { initializeCanvas, getCanvas } from './iot-engine/core/CanvasModule.js';
import { Engine } from './iot-engine/core/Engine.js';
import { Interactions } from './iot-engine/core/interactions/Interections.js';
import { RocketFakeGameImp as GameMain } from './games/GameOldPlaye2r.js';

window.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    const canvas = getCanvas();
    const ctx = canvas.getContext("2d");

    const eventshelper = new Interactions(canvas);

    const game = new Engine(new GameMain(canvas));
    game.init();
});
