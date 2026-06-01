/*
100kb. AWS max PutEvent size is 256KB.
But the results of JSON.stringify of the payload is increasing the
byte size by around 30kb. So the max byte size can only be around 30kb.
*/
export const MAX_PUT_EVENT_BYTE_SIZE = 30000;

export function groupIntoChunkByByteSize(args: {
  byteSize: number;
  data: any[];
}): any[][] {
  const payload: any[][] = [];

  let payloadIndex = 0;
  args.data.forEach((data) => {
    if (payload[payloadIndex] === undefined) {
      payload[payloadIndex] = [];
    }

    if (
      isFull({
        maxSize: args.byteSize,
        data1: payload[payloadIndex],
        data2: data,
      })
    ) {
      payloadIndex++;
      payload[payloadIndex] = [];
    }

    payload[payloadIndex].push(data);
  });

  return payload;
}

export function getByteSize(data: string): number {
  return JSON.stringify(data).replace(/[\[\]\,\"]/g, '').length;
}

export function isFull(args: {
  data1: any;
  data2: any;
  maxSize: number;
}): boolean {
  return (
    getByteSize(args.data1) + getByteSize(args.data2) >= args.maxSize - 5
  ); // Giving it a buffer of 5 bytes
}
