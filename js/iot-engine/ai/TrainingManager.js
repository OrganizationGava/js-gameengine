class TrainingManager {
    constructor() {
        this.cells = [];
        this.trainInterval = 1000;
        this.lastTrainTime = Date.now();
        this.worker = new Worker('trainerWorker.js');
        this.worker.onmessage = (e) => {
            const { weights } = e.data;
            this.updateAllBrains(weights);
        };
    }

    registerCell(cell) {
        this.cells.push(cell);
    }

    unregisterCell(cell) {
        this.cells = this.cells.filter(c => c !== cell);
    }

    async update(deltaTime) {
        const currentTime = Date.now();
        if (currentTime - this.lastTrainTime > this.trainInterval) {
            this.aggregateAndSendTrainingData();
            this.lastTrainTime = currentTime;
        }
    }

    aggregateAndSendTrainingData() {
        const globalTrainingInputs = [];
        const globalTrainingOutputs = [];

        for (let cell of this.cells) {
            globalTrainingInputs.push(...cell.brain.trainingInputs);
            globalTrainingOutputs.push(...cell.brain.trainingOutputs);
            cell.brain.trainingInputs = [];
            cell.brain.trainingOutputs = [];
        }

        if (globalTrainingInputs.length < 10) return;

        this.worker.postMessage({
            trainingInputs: globalTrainingInputs,
            trainingOutputs: globalTrainingOutputs,
        });
    }

    updateAllBrains(weights) {
        for (let cell of this.cells) {
            cell.brain.setWeights(weights);
        }
    }
}
