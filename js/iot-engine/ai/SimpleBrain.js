class SimpleBrain {
    constructor() {
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 2, activation: 'tanh' }));
        this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

        this.trainingInputs = [];
        this.trainingOutputs = [];
    }

    decide(inputs) {
        const inputTensor = tf.tensor2d([inputs]);
        const outputTensor = this.model.predict(inputTensor);
        const outputs = outputTensor.dataSync();
        tf.dispose([inputTensor, outputTensor]);
        return outputs;
    }

    addTrainingData(inputs, outputs) {
        this.trainingInputs.push(inputs);
        this.trainingOutputs.push(outputs);

        if (this.trainingInputs.length > 1000) {
            this.trainingInputs.shift();
            this.trainingOutputs.shift();
        }
    }

    setWeights(weights) {
        const tensorWeights = weights.map(w => tf.tensor(w));
        this.model.setWeights(tensorWeights);
        tensorWeights.forEach(t => t.dispose());
    }

    clone() {
        const newBrain = new SimpleBrain();
        newBrain.model.setWeights(this.model.getWeights().map(w => w.clone()));
        newBrain.trainingInputs = [...this.trainingInputs];
        newBrain.trainingOutputs = [...this.trainingOutputs];
        return newBrain;
    }
}
