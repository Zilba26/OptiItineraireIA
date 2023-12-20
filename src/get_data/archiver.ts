import archiver from 'archiver';
import * as fs from 'fs';
import admZip from 'adm-zip';

const zipName = 'archive.zip';
const jsonName = 'data.json';

export function archiveData(data: any) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.append(JSON.stringify(data), { name: jsonName });
  archive.finalize();

  const output = fs.createWriteStream(zipName);
  archive.pipe(output);

  output.on('close', () => {
    console.log('Archive créée avec succès.');
  });
  
  output.on('end', () => {
    console.log('Flux de sortie fermé.');
  });

  archive.on('error', (err) => {
    console.error('Erreur lors de la compression :', err);
  });
}

export function unzip() {
  const zipFileData = fs.readFileSync(zipName);

  const zip = new admZip(zipFileData);

  const zipEntries = zip.getEntries();

  const jsonEntry = zipEntries.find(entry => entry.entryName === jsonName);

  if (jsonEntry) {
    const jsonContent = zip.readAsText(jsonEntry);
    return JSON.parse(jsonContent);
  } else {
    console.error('Le fichier JSON n\'a pas été trouvé dans l\'archive.');
  }
}