import * as tf from "@tensorflow/tfjs";
import { getInputOutputTrainData } from "./get_data/get-data";

export async function run() {
  // Construction du modèle
  const model = tf.sequential();
  model.add(tf.layers.embedding({ inputDim: vocabSize, outputDim: embeddingDim, inputLength: sequenceLength }));
  model.add(tf.layers.lstm({ units: 50, returnSequences: true }));
  model.add(tf.layers.lstm({ units: 50 }));
  model.add(tf.layers.dense({ units: 3, activation: 'linear' }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  // Données d'entraînement (à adapter selon ta structure de données)
  const {input, output} = await getInputOutputTrainData();

  // Entraînement du modèle
  const xs = tf.tensor2d(input);
  const ys = tf.tensor2d(output);

  model.fit(xs, ys, { epochs: 100 }).then(() => {
    console.log('Entraînement terminé');
  });

  // Nouvelles données à prédire (à adapter selon ta structure de données)
  const newData = getNewData();

  const inputTensor = tf.tensor2d(newData.input);
  const predictions = model.predict(inputTensor);

  console.log(predictions.dataSync());
}
