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
      console.log("test model");
    })
    .catch((error) => {
      console.error("Erreur lors de l'entraînement du modèle :", error);
    });
}

// Fonction pour diviser les données en ensembles d'entraînement et de test
function splitData(
  data: any[],
  trainRatio: number = 0.8
): { trainingData: any[]; testingData: any[] } {
  const shuffledData = [...data].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffledData.length * trainRatio);
  const trainingData = shuffledData.slice(0, splitIndex);
  const testingData = shuffledData.slice(splitIndex);

  return { trainingData, testingData };
}

//la dimension de vos données d'entrée
const YOUR_INPUT_DIMENSION = 3; // ici 3 car (id, jour, heure)

// Fonction pour créer le modèle
function createModel(): tf.Sequential {
  const model = tf.sequential();

  // Ajouter une couche d'entrée
  model.add(
    tf.layers.dense({
      inputShape: [YOUR_INPUT_DIMENSION],
      units: 128,
      activation: "relu",
    })
  );

  // Ajouter une couche cachée
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));

  // Ajouter une couche de sortie
  const numTrafficCategories = 5; // Nombre de catégories de trafic ('Fluide', 'Dense', 'Saturé', 'Bloqué', 'Indéterminé')
  model.add(
    tf.layers.dense({ units: numTrafficCategories, activation: "softmax" })
  );

  // Compiler le modèle
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  console.log("Modèle créé");
  model.summary();

  return model;
}

// Fonction pour entraîner le modèle
async function trainModel(
  model: tf.Sequential,
  trainingData: any[],
  epochs: number = 50
): Promise<tf.History> {
  const inputs: number[][] = trainingData.map((item) => {
    // Convertir les données en tenseurs d'entrée
    return [
      parseFloat(item.id),
      new Date(item.timestamp).getDay(), // Jour de la semaine (0-6)
      parseFloat(item.timestamp.split("T")[1].split(":")[0]), // Heure du jour
    ];
  });

  const trafficLabels: string[] = trainingData.map((item) => item.traffic);
  const uniqueTrafficLabels: string[] = Array.from(new Set(trafficLabels)); // Obtenir les valeurs uniques

  const labels: number[][] = trainingData.map((item) => {
    const oneHotLabel: number[] = Array.from(
      { length: uniqueTrafficLabels.length },
      (_, index) => (item.traffic === uniqueTrafficLabels[index] ? 1 : 0)
    );
    return oneHotLabel;
  });

  const xs: tf.Tensor2D = tf.tensor2d(inputs);
  const ys: tf.Tensor2D = tf.tensor2d(labels);

  return model.fit(xs, ys, { epochs });
}

// Fonction pour tester le modèle
function testModel(model: tf.Sequential, testingData: any[]): void {
  const inputs: number[][] = testingData.map((item) => {
    // Convertir les données en tenseurs d'entrée
    return [
      parseFloat(item.id),
      new Date(item.timestamp).getDay(), // Jour de la semaine (0-6)
      parseFloat(item.timestamp.split("T")[1].split(":")[0]), // Heure du jour
    ];
  });

  const trafficLabels: string[] = testingData.map((item) => item.traffic);
  const uniqueTrafficLabels: string[] = Array.from(new Set(trafficLabels)); // Obtenir les valeurs uniques

  console.log("Étiquettes uniques :");
  console.log(uniqueTrafficLabels);

  const labels: number[][] = testingData.map((item) => {
    const oneHotLabel: number[] = Array.from(
      { length: uniqueTrafficLabels.length },
      (_, index) => (item.traffic === uniqueTrafficLabels[index] ? 1 : 0)
    );
    return oneHotLabel;
  });

  const xs: tf.Tensor2D = tf.tensor2d(inputs);
  const ys: tf.Tensor2D = tf.tensor2d(labels);

  const predictions: tf.Tensor = model.predict(xs) as tf.Tensor;

  // Obtenir les indices des valeurs maximales dans chaque tableau de probabilités
  const predictedIndices: number[] = (
    tf.argMax(predictions, 1) as tf.Tensor
  ).arraySync() as number[];

  // Convertir les indices en noms de classes
  const predictedTraffic: string[] = predictedIndices.map(
    (index) => uniqueTrafficLabels[index]
  );

  // Créer un tableau avec les données pour afficher dans la console
  const comparisonData = testingData.map((item, i) => ({
    Actual: item.traffic,
    Predicted: predictedTraffic[i],
    Correct: item.traffic === predictedTraffic[i] ? "✅" : "❌",
  }));

  // Afficher le tableau dans la console
  console.table(comparisonData);
}
