export function groupIntoChunk(args: {
  chunkSize: number;
  data: any[];
}) {
  const chunkedData = [];
  for (let i = 0; i < args.data.length; i += args.chunkSize) {
    chunkedData.push(args.data.slice(i, i + args.chunkSize));
  }

  return chunkedData;
}
