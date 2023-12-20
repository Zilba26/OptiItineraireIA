import * as tf from "@tensorflow/tfjs";
import { getData } from "./get_data/get-data";

export async function main() {
  const formattedData = await getData();

  // Diviser les données en ensembles d'entraînement et de test
  const { trainingData, testingData } = splitData(formattedData);

  // Créer le modèle
  const model = createModel();

  // Entraîner le modèle
  trainModel(model, trainingData)
    .then(() => {
      // Tester le modèle
      testModel(model, testingData);
    })
    .catch(error => {
      console.error("Erreur lors de l'entraînement du modèle :", error);
    });

}

// Fonction pour diviser les données en ensembles d'entraînement et de test
function splitData(data: any[], trainRatio: number = 0.8): { trainingData: any[]; testingData: any[] } {
  const shuffledData = [...data].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffledData.length * trainRatio);
  const trainingData = shuffledData.slice(0, splitIndex);
  const testingData = shuffledData.slice(splitIndex);

  return { trainingData, testingData };
}

// Remplacez YOUR_INPUT_DIMENSION par la dimension de vos données d'entrée
const YOUR_INPUT_DIMENSION = 5; // À ajuster selon la structure de vos données

// Remplacez NUM_CLASSES par le nombre de classes pour la classification
const NUM_CLASSES = 3; // À ajuster selon le nombre de classes dans vos données

// Fonction pour créer le modèle
function createModel(): tf.LayersModel {
  const model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [YOUR_INPUT_DIMENSION], units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

// Fonction pour entraîner le modèle
async function trainModel(model: tf.LayersModel, trainingData: any[]): Promise<void> {
  const inputs = tf.tensor2d(trainingData.map(entry => [/* convertir les données d'entrée */]));
  const labels = tf.oneHot(trainingData.map(entry => /* convertir les étiquettes en indices */), NUM_CLASSES);

  await model.fit(inputs, labels, {
    epochs: 10,
    shuffle: true,
    validationSplit: 0.2,
  });
}

// Fonction pour tester le modèle
function testModel(model: tf.LayersModel, testingData: any[]): void {
  const inputs = tf.tensor2d(testingData.map(entry => [/* convertir les données d'entrée */]));
  const labels = tf.oneHot(testingData.map(entry => /* convertir les étiquettes en indices */), NUM_CLASSES);

  const result = model.evaluate(inputs, labels);
  console.log('Loss:', result[0].dataSync()[0]);
  console.log('Accuracy:', result[1].dataSync()[0]);
}
