import { LocationCollection } from '../models/general/location.type';
import { generateToken } from './token.service';
import axios from 'axios';
import { isNull } from './is-null.function';
import { EVFreaksLocation } from '../index';

export async function getLocationsFromEvFreaksAPI(args: { limit?: number; offset?: number; updated: boolean; }): Promise<LocationCollection> {
  const token = generateToken();

  let url = `${process.env.evFreaksApiUrl}/locations?desired-fields=ocpi,peerID,partyID,locationID,name,operatorName,id,company,peer,countryCode,lastUpdated,rank,createdAt,updatedAt,powerLevel,powerLevels,plugs,_primary`;

  if (args.updated) {
    const lastFewSeconds = new Date(Date.now() - (11 * 1000)).toISOString(); // 11 seconds
    url = `${url}&updated=${lastFewSeconds}`;
  } else {
    if (isNull(args.limit) || isNull(args.offset)) {
      throw new Error('Invalid pagination value.');
    }

    url = `${url}&limit=${args.limit}&offset=${args.offset}`
  }

  const client = axios.create({ baseURL: url });

  let isSuccessful = false, retry = 0;

  let data;

  while (!isSuccessful && retry < 20) {
    retry++;

    try {
      const results = await client.get('', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      isSuccessful = true;

      data = {
        ...results.data,
        locations: results.data.locations.map((val: any) => new EVFreaksLocation(val)),
      };
    } catch (err) {
      isSuccessful = false;

      console.log('failed to get locations >>>', err);

      await new Promise(resolve => setTimeout(resolve, 1000 * retry));

      if (retry === 20) {
        console.error('Failed to retrieve data from EVFreaks API.');
        throw err;
      }
    }
  }

  return data;
}
