import axios, { AxiosInstance } from 'axios';
import { ActiveCpo } from '../domain';

export class InternalApiService {
  private apiUrl = process.env.backendApiUrl ?? 'https://api.example.com/api';
  private client: AxiosInstance;

  private async initClient(): Promise<void> {
    if (!this.apiUrl) {
      throw new Error('Backend API URL is not configured.');
    }

    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: { 'x-api-token': process.env.INTERNAL_API_TOKEN ?? 'replace-me' }
    });
  }

  private async handleRequest(operation: string, url: string, payloads: any = {}): Promise<any> {
    await this.initClient();

    try {
      return await (this.client as any)[operation](url, payloads);
    } catch (err: any) {
      if (err.status === 403) {
        try {
          await sleep();
          return await (this.client as any)[operation](url, payloads);
        } catch (err2) {
          console.log('Failed after retry:');
          console.error(err2);
          throw err2;
        }
      } else {
        console.error(err);
        throw err;
      }
    }
  }

  async getActiveCpos(): Promise<ActiveCpo[]> {
    return this.handleRequest('get', '/cpo/active').then((data: any) => data.data);
  }

  async getLocationCity(locationId: string): Promise<string> {
    return this.handleRequest('get', `/locations/${locationId}/city`).then((data: any) => data.data);
  }

  async getLogsLastMinute(): Promise<any[]> {
    return this.handleRequest('get', `/status-logs/last-minute`).then((data: any) => data.data);
  }

  async getLogsForPredictionsProcessing(primaryIds: string[]): Promise<any[]> {
    return this.handleRequest('get', `/status-logs/by-primary-ids?primaryIds=${primaryIds}`).then((data: any) => data.data);
  }

  async getEvsePowerTypesByPrimaryIds(payload: string[]): Promise<any[]> {
    return this.handleRequest('get', `/evses/with/power-type/evse-primary-id?evsePrimaryIds=${payload.join(',')}`).then((data: any) => data.data);
  }

  async isLocationWithinPartyId(partyId: string, locationId: string): Promise<boolean> {
    return this.handleRequest('get', `/access-scopes/party-ids/${partyId}/location-id/${locationId}`).then((data: any) => !!data.isWithinScope);
  }

  async processPredictionsReports(): Promise<void> {
    await this.handleRequest('get', '/reports/process');
  }

  async processUtilisationStatusReports(): Promise<void> {
    await this.handleRequest('post', '/utilisations-radar');
  }

  async processEVFreaksLocations(payloads: any): Promise<void> {
    await this.handleRequest('post', '/locations/ev-freaks/process', payloads);
  }

  async triggerEVFreaksStoringLocationsSideEffects(payloads: any): Promise<void> {
    await this.handleRequest('post', '/locations/ev-freaks/trigger-side-effects', payloads);
  }
}

async function sleep(ms: number = 2000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), ms);
  });
}

