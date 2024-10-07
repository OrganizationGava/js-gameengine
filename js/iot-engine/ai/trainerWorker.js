self.onmessage = async function(e) {
    const { trainingInputs, trainingOutputs } = e.data;

    if (trainingInputs.length === 0) {
        self.postMessage({ error: 'No training data received.' });
        return;
    }

    const xs = tf.tensor2d(trainingInputs);
    const ys = tf.tensor2d(trainingOutputs);

    try {
        await model.fit(xs, ys, {
            epochs: 1,
            batchSize: 32,
            shuffle: true,
        });

        const weights = model.getWeights().map(w => w.arraySync());
        self.postMessage({ weights });
    } catch (error) {
        self.postMessage({ error: error.message });
    }

    tf.dispose([xs, ys]);
};
