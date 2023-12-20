import * as tf from "@tensorflow/tfjs";
import { getInputOutputTrainData } from "./get_data/get-data";

export async function run() {
  // Données d'entraînement (à adapter selon ta structure de données)
  const { input, output } = await getInputOutputTrainData();
  console.log(input[0], output[0]);

  const differentsIds = [...new Set(input.map((data) => data[0]))];
  console.log("nb id : " + differentsIds.length);

  // Construction du modèle
  const model = tf.sequential();
  model.add(tf.layers.embedding({ inputDim: differentsIds.length, outputDim: 50, inputLength: 2 }));
  model.add(tf.layers.lstm({ units: 50, returnSequences: true }));
  model.add(tf.layers.lstm({ units: 50 }));
  model.add(tf.layers.dense({ units: 3, activation: 'linear' }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  console.log("Model créé");
  console.log(model.summary());

  // Entraînement du modèle
  const xs = tf.tensor2d(input);
  const ys = tf.tensor2d(output);

  await model.fit(xs, ys, { epochs: 100 });

  console.log("Model entraîné");

  // Nouvelles données à prédire (à adapter selon ta structure de données)
  const newData = [[772, new Date("2023-12-13T17:40:00.449+01:00").getTime()]];

  // Nouvelles données à prédire (à adapter selon ta structure de données)
  const inputTensor = tf.tensor2d(newData);
  const predictions = model.predict(inputTensor);

  console.log(predictions);
}
