import { unzip } from './archiver';

export async function getData() {
  //const content = await fs.readFile("data.json", 'utf-8');
  //const contentData = JSON.parse(content) as any;
  const contentData = await unzip();

  const data: any[] = [];
  Object.entries(contentData).forEach(([timestampKey, value]) => {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
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
  const input: number[][] = [];
  const output: number[][] = [];

  for (const data of dataList) {
    const { id, timestamp, speed, time, traffic } = data;
    const inputObj: number[] = [parseInt(id), new Date(timestamp).getTime()];
    const outputObj: number[] = [parseInt(speed), parseInt(time), getTrafficCode(traffic)];

    input.push(inputObj);
    output.push(outputObj);
  }

  return { input, output };
}

function getTrafficCode(traffic: string): number {
  switch (traffic) {
    case "Indéterminé":
      return 0;
    case "Fluide":
      return 1;
    case "Dense":
      return 2;
    case "Saturé":
      return 3;
    case "Bloqué":
      return 4;
    default:
      throw new Error("Traffic code {" + traffic + "} not found");
  }
}