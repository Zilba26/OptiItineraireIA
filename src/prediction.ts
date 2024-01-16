import * as tf from "@tensorflow/tfjs";
import { getData } from "./get_data/get-data";
import { downLoadAllFiles } from "./firebase";

export async function main() {
  // Chargement des données
  console.log("Chargement des données...");
  //const firebaseData = await downLoadAllFiles();
  const originalData = await getData("221");
  console.log("Données chargées (Length : " + originalData.length + ")");

  // Répliquer les données en ajoutant une semaine plusieurs fois
  //const replicatedData = replicateDataWithTimeShift(originalData, 1);

  // Diviser les données en ensembles d'entraînement et de test
  console.log("Division des données...");
  const { trainingData, testingData } = splitData(originalData);

  // Créer le modèle
  console.log("Création du modèle...");
  const model = createModel();

  // Entraîner le modèle
  console.log("Entraînement du modèle...");
  try {
    await trainModel(model, trainingData);
    console.log("Test du modèle...");
    await testModel(model, testingData);
    console.log("Test du modèle terminé");    return model;
  } catch (error) {
    console.error("Erreur lors de l'entraînement du modèle :", error);
    return null;
  }
}

// Fonction pour répliquer les données en ajoutant une semaine plusieurs fois
function replicateDataWithTimeShift(
  originalData: any[],
  numberOfWeeks: number
) {
  const replicatedData: {
    id: any;
    timestamp: string; // Convertir en format ISO
    traffic: any;
  }[] = [];

  // Parcourir les données existantes
  originalData.forEach((dataPoint) => {
    // Récupérer le timestamp d'origine
    const originalTimestamp = new Date(dataPoint.timestamp);

    // Répliquer les données en ajoutant une semaine plusieurs fois
    for (let i = 0; i < numberOfWeeks; i++) {
      // Calculer le nouveau timestamp en ajoutant le nombre de millisecondes pour une semaine
      const newTimestamp = new Date(
        originalTimestamp.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );

      // Ajouter la nouvelle donnée répliquée
      replicatedData.push({
        id: dataPoint.id,
        timestamp: newTimestamp.toISOString(), // Convertir en format ISO
        traffic: dataPoint.traffic,
      });
    }
  });

  return replicatedData;
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
const YOUR_INPUT_DIMENSION = 3; // ici 4 car (id, jour, heureMinute)
const numTrafficCategories = 4; // Nombre de catégories de trafic ('Fluide', 'Dense', 'Saturé', 'Bloqué')

// Fonction pour créer le modèle
function createModel(): tf.Sequential {
  const model = tf.sequential();

  // Ajouter une couche d'entrée
  model.add(
    tf.layers.dense({
      inputShape: [YOUR_INPUT_DIMENSION],
      units: 64,
      activation: "relu",
    })
  );

  // Ajouter une couche cachée
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));

  // Ajouter une couche de sortie
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

//fonction qui prend en paramètre heure et minute et qui retourne une heure à virgule
function getHourMinute(hour: number, minute: number): number {
  return hour + minute / 60;
}

// Fonction pour entraîner le modèle
async function trainModel(
  model: tf.Sequential,
  trainingData: any[],
  epochs: number = 50
): Promise<tf.History> {
  // Convertir les données d'entraînement en tenseurs
  const inputs: number[][] = trainingData.map((item) => {
    // Convertir les données en tenseurs d'entrée
    return [
      parseFloat(item.id),
      new Date(item.timestamp).getDay(), // Jour de la semaine (0-6)
      getHourMinute(
        parseFloat(item.timestamp.split("T")[1].split(":")[0]), // Heure du jour
        parseFloat(item.timestamp.split("T")[1].split(":")[1].split(":")[0])
      ), // Minute de l'heure
    ];
  });

  // Extraire les étiquettes de trafic
  const trafficLabels: string[] = trainingData.map((item) => item.traffic);

  // Encoder les étiquettes en one-hot
  const uniqueTrafficLabels: string[] = Array.from(new Set(trafficLabels)); // Obtenir les valeurs uniques

  const labels: number[][] = trainingData.map((item) => {
    const oneHotLabel: number[] = Array.from(
      { length: uniqueTrafficLabels.length },
      (_, index) => (item.traffic === uniqueTrafficLabels[index] ? 1 : 0)
    );
    return oneHotLabel;
  });

  // Convertir les tableaux d'entrée et d'étiquettes en tenseurs TensorFlow
  const xs: tf.Tensor2D = tf.tensor2d(inputs);
  const ys: tf.Tensor2D = tf.tensor2d(labels);

  // Entraîner le modèle avec les tenseurs d'entrée et d'étiquettes
  return model.fit(xs, ys, { epochs });
}

// Fonction pour tester le modèle
async function testModel(
  model: tf.Sequential,
  testingData: any[]
): Promise<void> {
  // Convertir les données de test en tenseurs
  const inputs: number[][] = testingData.map((item) => {
    return [
      parseFloat(item.id),
      new Date(item.timestamp).getDay(),
      getHourMinute(
        parseFloat(item.timestamp.split("T")[1].split(":")[0]),
        parseFloat(item.timestamp.split("T")[1].split(":")[1].split(":")[0])
      ),
    ];
  });

  // Extraire les étiquettes de trafic
  const trafficLabels: string[] = testingData.map((item) => item.traffic);

  // Encoder les étiquettes en one-hot
  const uniqueTrafficLabels: string[] = Array.from(new Set(trafficLabels)); // Obtenir les valeurs uniques

  const labels: number[][] = testingData.map((item) => {
    const oneHotLabel: number[] = Array.from(
      { length: uniqueTrafficLabels.length },
      (_, index) => (item.traffic === uniqueTrafficLabels[index] ? 1 : 0)
    );
    return oneHotLabel;
  });

  // Convertir les tableaux d'entrée et d'étiquettes en tenseurs TensorFlow
  const xs: tf.Tensor2D = tf.tensor2d(inputs);
  const ys: tf.Tensor2D = tf.tensor2d(labels);

  // Obtenir les prédictions du modèle
  const predictions: tf.Tensor = model.predict(xs) as tf.Tensor;

  // Comparer les prédictions avec les étiquettes réelles
  const yTrue: tf.Tensor = tf.argMax(ys, 1);
  const yPred: tf.Tensor = tf.argMax(predictions, 1);

  // Afficher des statistiques sur les réussites et les échecs
  const correctPredictions: tf.Tensor = tf.equal(yTrue, yPred);
  const numCorrect: number = tf
    .sum(tf.cast(correctPredictions, "int32"))
    .arraySync() as number;
  const accuracy: number = numCorrect / testingData.length;

  // Afficher les états réels du trafic dans les statistiques
  const trafficStats: { [key: string]: number } = {};
  trafficLabels.forEach((label) => {
    trafficStats[label] = (trafficStats[label] || 0) + 1;
  });

  // Afficher les états prédits du trafic dans les statistiques
  const predictedTrafficStats: { [key: string]: number } = {};
  const predictedLabelsArray: number[] = yPred.arraySync() as number[];
  predictedLabelsArray.forEach((labelIndex) => {
    const predictedLabel = uniqueTrafficLabels[labelIndex];
    predictedTrafficStats[predictedLabel] =
      (predictedTrafficStats[predictedLabel] || 0) + 1;
  });

  console.log("Statistiques du modèle :");
  console.log("Nombre de prédictions correctes :", numCorrect);
  console.log("Précision du modèle :", accuracy);
  console.log("États réels du trafic :", trafficStats);
  console.log("États prédits du trafic :", predictedTrafficStats);
}

// Fonction pour faire une prédiction pour une route
export async function predictForRoute(
  model: tf.Sequential,
  routeData: {"id": string, "timestamp": string}
): Promise<string> {
  // Convertir les données de la route en tenseur
  const input: number[] = [
    parseFloat(routeData.id),
    new Date(routeData.timestamp).getDay(),
    getHourMinute(
      parseFloat(routeData.timestamp.split("T")[1].split(":")[0]),
      parseFloat(routeData.timestamp.split("T")[1].split(":")[1].split(":")[0])
    ),
  ];

  const xs: tf.Tensor2D = tf.tensor2d([input]);

  // Faire la prédiction avec le modèle
  const predictions: tf.Tensor = model.predict(xs) as tf.Tensor;

  // Obtenir l'indice de la catégorie prédite
  const predictedCategoryIndex: number = (
    await tf.argMax(predictions, 1).data()
  )[0];

  // Mapper l'indice prédit à la catégorie de trafic correspondante
  const trafficCategories = [
    "Fluide",
    "Dense",
    "Saturé",
    "Bloqué",
    "Indéterminé",
  ];
  const predictedCategory: string = trafficCategories[predictedCategoryIndex];

  return predictedCategory;
}
