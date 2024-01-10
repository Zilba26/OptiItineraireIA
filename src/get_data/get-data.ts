import { unzip } from './archiver';

export async function getData() {
  //const content = await fs.readFile("data.json", 'utf-8');
  //const contentData = JSON.parse(content) as any;
  const contentData = await unzip();

  const data: any[] = [];
  Object.entries(contentData).forEach(([timestampKey, value]) => {
    if (Array.isArray(value)) {
      for(let i = 0; i < value.length; i++) {
        const roadData = value[i].split(";");
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
  return data;
}

export async function getInputOutputTrainData(): Promise<{ input: any[], output: any[] }> {
  const dataList = await getData();
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