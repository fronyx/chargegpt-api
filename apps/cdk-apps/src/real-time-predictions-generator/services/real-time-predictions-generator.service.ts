import { Lambda } from 'aws-sdk';
import { groupIntoChunk } from '../../shared/utils/group-into-chunk';
import { format } from 'date-fns';
import { InternalApiService } from '../../shared/services/internal-api.service';
import { groupIntoChunkByByteSize } from '../../shared/utils/group-into-chunk-by-byte-size.function';

let lambda: any = null;
let scopedPrimaryIds: string[] | null = null;

interface StatusLog {
  status: string;
  last_updated: number;
  evse_primary_id: string;
}

interface EvsesAndPwt {
  primary_id: string[];
  power_type_list: string[][];
}

interface LastUpdatedAndStatus {
  primary_id: string[];
  last_updated_list: string[][];
  status_list: string[][];
}

interface AvPredProcessPayload {
  start_time: string;
  primary_id: string[];
  power_type_list: string[][];
  last_updated_list: string[][];
  status_list: string[][];
  i: string;
  test?: number;
}

interface LambdaInvokeParams {
  FunctionName: string;
  InvocationType: 'Event' | 'RequestResponse' | 'DryRun';
  Payload: string;
  LogType: 'None' | 'Tail';
}

export async function processLastUpdatedEvses() {
  // console.log('Starting the real time predictions process.');

  await initializeConnections();

  await initializeScopedEvseList();

  const last1MinutesStatusLogs = await getStatusLogsLast1Minute();

  if (last1MinutesStatusLogs.length < 1) {
    // console.log('No updates available. Aborting process.');
    return false;
  }

  const scopedStatusLogs = await removeOutOfScopeStatusLogs(last1MinutesStatusLogs);

  if (scopedStatusLogs.length < 1) {
    // console.log('No updates available. Aborting process.');
    return false;
  }

  const primaryIds = filterDuplicatedIds({ ids: getLatestUpdatedIds(scopedStatusLogs) });

  if (primaryIds.length < 0) {
    // console.log('No updates available. Aborting process.');
    return false;
  }
  await getAvPredProcessPayload(primaryIds);

  console.log('Finish triggering real time predictions');

  return true;
}

async function removeOutOfScopeStatusLogs(statusLogs: StatusLog[]): Promise<StatusLog[]> {
  if (scopedPrimaryIds === null) {
    await initializeScopedEvseList();
  }

  // console.log('Removing out of scope status logs.');

  const idMap = scopedPrimaryIds!
    .reduce((acc: any, val: any) => {
      acc[val] = true;
      return acc;
    }, {});

  return statusLogs.filter(({ evse_primary_id }) => !!idMap[evse_primary_id]);
}

async function initializeConnections() {
  // console.log('Initializing the connections.');

  if (lambda === null) {
    lambda = new Lambda({ apiVersion: '2015-03-31' });
  }
}

async function initializeScopedEvseList() {
  // console.log('Initializing scoped evses.');

  if (scopedPrimaryIds !== null || (scopedPrimaryIds ?? []).length > 200000) {
    return;
  }

  try {
    scopedPrimaryIds = await new InternalApiService().getAllRealTimePrimaryIds();
  } catch (err) {
    throw new Error(`Error getting scoped evses: ${(err as Error).message}`);
  }

  // console.log('Finished initializing scoped evses.');
}

function filterDuplicatedIds(args: {
  ids: string[];
}): string[] {
  const idMap = args.ids
    .filter((val: string) => val !== null)
    .filter((val: string) => val !== 'null')
    .filter((val: string) => val !== '')
    .reduce((acc: any, val: string) => {
      acc[val] = true;
      return acc;
    }, {});

  return Object.keys(idMap);
}

async function getStatusLogsLast1Minute(): Promise<any> {
  // console.log('Getting last 1 minutes status logs.');

  const now = new Date();
  const last1Minutes = new Date(now);
  last1Minutes.setMinutes(now.getMinutes() - 1);

  try {
    const results: StatusLog[] = await new InternalApiService().getLogsLastMinute();

    // console.log('Finished getting last 1 minutes status logs.');

    return results;
  } catch (err) {
    console.error(err);
    throw new Error(`Error getting status logs: ${(err as Error).message}`);
  }
}

async function getStatusLogsForPrimaryIdsForLast8Hours(args: { primaryIds: string[]; }): Promise<StatusLog[]> {
  let statusLogs: StatusLog[] = [];

  try {
    const chunks = groupIntoChunk({ data: args.primaryIds, chunkSize: 20 });

    for (const primaryIds of chunks) {
      const results: StatusLog[] = await new InternalApiService().getLogsForPredictionsProcessing(primaryIds);
      statusLogs = statusLogs.concat(results);
    }

    // console.log('Finished getting last 8 hours status logs.');

    return statusLogs;
  } catch (err) {
    console.error(err);
    throw new Error(`Error getting status logs: ${(err as Error).message}`);
  }
}

async function getLastUpdatedAndStatus(primaryIds: string[]): Promise<LastUpdatedAndStatus> {
  // console.log('Getting last updated and status.');

  let lastUpdatedStatusPayload: Record<string, {
    primary_id: string;
    last_updated_list: string[];
    status_list: string[];
  }>;

  const statusLogs: any = await getStatusLogsForPrimaryIdsForLast8Hours({ primaryIds });

  lastUpdatedStatusPayload = statusLogs.reduce((acc: any, val: any) => {
    const primaryId = val.evse_primary_id;
    acc[primaryId] = acc[primaryId] ?? {
      primary_id: primaryId,
      last_updated_list: [],
      status_list: [],
    };
    acc[primaryId].status_list.push(val.status);
    acc[primaryId].last_updated_list.push(format(new Date(val.last_updated), 'yyyy-MM-dd HH:mm:ss:SSSSSS'));
    return acc;
  }, {});

  const primary_id: string[] = [];
  const status_list: string[][] = [];
  const last_updated_list: string[][] = [];

  Object.values(lastUpdatedStatusPayload).forEach(val => {
    primary_id.push(val.primary_id);
    status_list.push(val.status_list);
    last_updated_list.push(val.last_updated_list);
  });

  // console.log('Finished getting last updated and status.');
  return {
    primary_id,
    status_list,
    last_updated_list,
  };
}

async function getEvsesPowerType(args: { primaryIds: string[]; }): Promise<EvsesAndPwt> {
  // console.log('Getting EVSE power types.');

  try {
    const chunks = groupIntoChunk({ data: args.primaryIds, chunkSize: 30 });
    let powerTypePayload: Record<string, {
      primary_id: string;
      power_type_list: string[];
    }> = {};

    for (const primaryIds of chunks) {
      const results: any = await new InternalApiService().getEvsePowerTypesByPrimaryIds(primaryIds);
      powerTypePayload = results.reduce((acc: any, val: any) => {
        acc[val.evse] = acc[val.evse] ?? {
          primary_id: val.evse,
          power_type_list: [],
        };
        acc[val.evse].power_type_list.push(val.power_type);
        return acc;
      }, powerTypePayload);
    }

    const primary_id: string[] = [];
    const power_type_list: string[][] = [];

    Object.values(powerTypePayload).forEach(val => {
      primary_id.push(val.primary_id);
      power_type_list.push(val.power_type_list);
    });

    // console.log('Finished getting EVSE power types.');

    return {
      primary_id,
      power_type_list,
    };
  } catch (err) {
    throw new Error(`Error getting power type: ${(err as Error).message}`);
  }
}

function getLatestUpdatedIds(statusLogs: StatusLog[]): string[] {
  return statusLogs.map(({ evse_primary_id }: any) => evse_primary_id);
}

async function getAvPredProcessPayload(primaryIds: string[]) {
  const evsesAndPwt = await getEvsesPowerType({ primaryIds });
  const lastUpdatedAndStatus = await getLastUpdatedAndStatus(primaryIds);
  await convertPayloadIntoChunk(evsesAndPwt, lastUpdatedAndStatus);
}

async function convertPayloadIntoChunk(evsesAndPwt: EvsesAndPwt, lastUpdatedAndStatus: LastUpdatedAndStatus) {
  const combination: any = [];
  evsesAndPwt.primary_id.forEach((id, index) => {
    combination.push({
      primaryId: id,
      powerType: evsesAndPwt.power_type_list[index],
      lastUpdated: lastUpdatedAndStatus.last_updated_list[index],
      status: lastUpdatedAndStatus.status_list[index],
    });
  });

  const chunks = groupIntoChunkByByteSize({ data: combination, byteSize: 200000 });
  for (let chunk of chunks) {
    await invokeLambdaFunction(await convertIntoAIPayload(chunk));
  }
}

async function invokeLambdaFunction(payload: AvPredProcessPayload) {
  // console.log('Triggering avPredProcess.');

  const params: LambdaInvokeParams = {
    FunctionName: 'AvailabilityPredictionsStack-ProcessCB70800C-Jh6cTaFEfwvS',
    InvocationType: 'Event',
    LogType: 'None',
    Payload: JSON.stringify(payload),
  };

  await new Promise<boolean>((resolve, reject) => {
    lambda.invoke(params, (err: any, res: any) => {
      if (err) {
        reject(new Error(`Error invoking avPredProcess: ${err.message}`));
      } else {
        // console.log('Invocation results:', JSON.stringify(res, null, 2));
        resolve(true);
      }
    });
  });
}

async function convertIntoAIPayload(data: {
  primaryId: string;
  powerType: string[];
  lastUpdated: string[];
  status: string[];
}[]): Promise<AvPredProcessPayload> {
  const payload: AvPredProcessPayload = {
    primary_id: [],
    power_type_list: [],
    last_updated_list: [],
    status_list: [],
    i: 'REAL_TIME',
    start_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  };
  data.forEach(({ primaryId, status, powerType, lastUpdated }, index) => {
    payload.primary_id[index] = primaryId;
    payload.power_type_list[index] = powerType;
    payload.last_updated_list[index] = lastUpdated;
    payload.status_list[index] = status;
  });
  return payload;
}