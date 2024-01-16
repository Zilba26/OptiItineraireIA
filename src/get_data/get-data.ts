import { unzip } from './archiver';

export async function getData(id?: string) {
  //const content = await fs.readFile("data.json", 'utf-8');
  //const contentData = JSON.parse(content) as any;
  const data: any[] = [];
  const testData = new Map<string, number>();

  // Date de début des données au 10 janvier 2024
  const beginDate = new Date(2023, 11, 28, 0, 0, 0);
  const currentDate = new Date();
  let currentDateCopy = new Date(beginDate);

  while (currentDateCopy < currentDate) {
    const year = currentDateCopy.getFullYear();
    const month = currentDateCopy.getMonth() + 1;
    const day = currentDateCopy.getDate();
    const dateString = `${month}.${day}.${year}`;
    const fileName = `archives/archive-s-${dateString}.zip`;
    const contentData = await unzip(fileName);

    Object.entries(contentData).forEach(([timestampKey, value]) => {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const roadData = value[i].split(";");
          if (roadData[4].startsWith("Sat") || roadData[4].startsWith("Blo") || roadData[4].startsWith("Den")) {
            if (testData.has(roadData[0])) {
              testData.set(roadData[0], testData.get(roadData[0])! + 1);
            } else {
              testData.set(roadData[0], 1);
            }
            if (roadData[0] == "221") console.log("221 - " + roadData[4] + " - " + new Date(timestampKey).toLocaleDateString() + " - " + new Date(timestampKey).toLocaleTimeString());
          }
          if ((id && id != roadData[0]) || roadData[4].startsWith("Ind")) {
            continue;
          }
          data.push({
            id: roadData[0],
            name: roadData[1],
            timestamp: timestampKey,
            speed: roadData[2],
            time: roadData[3],
            traffic: roadData[4],
            coordinates: roadData[5]
          });
        }
      }
    });


    currentDateCopy = new Date(currentDateCopy.getTime() + 24 * 60 * 60 * 1000);
  }

  const testDataSorted = new Map([...testData.entries()].sort((a, b) => b[1] - a[1]));
  console.log("test data sorted: ");
  testDataSorted.forEach((value, key) => {
    if (value > 300) console.log(key + " with " + value);
  });
  return data;
}

export async function getInputOutputTrainData(): Promise<{ input: any[], output: any[] }> {
  const dataList: any = [];
  const input: any[] = [];
  const output: string[] = [];

  for (const data of dataList) {
    const { id, speed, time, traffic } = data;
    const resultObj: any = { speed, time, traffic };

    input.push(resultObj);
    output.push(id);
  }

  return { input, output };
}