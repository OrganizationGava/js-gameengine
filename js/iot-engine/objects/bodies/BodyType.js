import { HashTable } from    '../../helpers/HashSet.js';
import { initializeCanvas, getCanvas } from '../../core/CanvasModule.js';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const bodyType = new HashTable();
bodyType.set('static', {mass: 0, velocity: 0, moved: 0});
bodyType.set('dynamic', {mass: 0, velocity: 1, moved: 1});
bodyType.set('kinematic', {mass: 1, velocity: 1, moved: 1});

export class BodyDefType {
    constructor(bodyTypeP) {
        this.bodyType = bodyType.get(bodyTypeP);
    }
}