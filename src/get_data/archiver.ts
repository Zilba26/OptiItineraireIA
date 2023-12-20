import JSZip from "jszip";

const zipName = 'archive.zip';
const jsonName = 'data.json';

export async function unzip() {
  // Utilisez fetch pour récupérer le fichier zip depuis le dossier public
  const response = await fetch(zipName);
  const zipBuffer = await response.arrayBuffer();

  // Utilisez JSZip pour décompresser le fichier zip
  const zip = await JSZip.loadAsync(zipBuffer);

  // Obtenez les entrées du zip
  const zipEntries = Object.values(zip.files);

  // Recherchez l'entrée JSON
  const jsonEntry = zipEntries.find(entry => entry.name === jsonName);

  if (jsonEntry) {
    // Obtenez le contenu du fichier JSON
    const jsonContent = await jsonEntry.async('text');
    return JSON.parse(jsonContent);
  } else {
    console.error('Le fichier JSON n\'a pas été trouvé dans l\'archive.');
  }
}