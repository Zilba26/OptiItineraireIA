import { initializeApp } from "firebase/app"
import { StorageReference, getDownloadURL, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBh8A4T49s4jWJ3Gdl7_j78i-5Idm5GRKM",
  authDomain: "roaddatanantes.firebaseapp.com",
  projectId: "roaddatanantes",
  storageBucket: "roaddatanantes.appspot.com",
  messagingSenderId: "106045506813",
  appId: "1:106045506813:web:95f107d323382a310aea94",
  measurementId: "G-SCL1KBRLZ7"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Date de début des données au 10 janvier 2024
const beginDate = new Date(2023, 11, 27, 0, 0, 0);

async function downloadFile(fileRef: StorageReference) {
  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    return await response.arrayBuffer();
  } catch (error: any) {
    console.error(error);
  }
}

export async function downLoadAllFiles() {
  const currentDate = new Date();
  let currentDateCopy = new Date(beginDate);
  const result: ArrayBuffer[] = [];
  while (currentDateCopy < currentDate) {
    const year = currentDateCopy.getFullYear();
    const month = currentDateCopy.getMonth() + 1;
    const day = currentDateCopy.getDate();
    const dateString = `${month}.${day}.${year}`;
    const fileRef = ref(storage, `archive-s-${dateString}.zip`);
    try {
      const file = await downloadFile(fileRef);
      result.push(file!);
      console.log(`File ${dateString} downloaded`);
    } catch (error: any) {
      console.error(`File ${dateString} not found`);
    }
    currentDateCopy = new Date(currentDateCopy.getTime() + 24 * 60 * 60 * 1000);
  }
  return result;
}
