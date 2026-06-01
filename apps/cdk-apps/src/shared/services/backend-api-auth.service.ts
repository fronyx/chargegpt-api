import axios from 'axios';
import { URLSearchParams } from 'url';
import { BACKEND_API_AUDIENCE } from '../models/general/auth.constants';

let accessToken: string | null = null;

export class BackendApiAuthService {
    static async getAccessToken(): Promise<string> {
        if (!accessToken) {
            const options = {
                method: 'POST',
                url: process.env.BACKEND_AUTH_TOKEN_URL ?? 'https://auth.example.com/oauth/token',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: process.env.BACKEND_AUTH_CLIENT_ID ?? 'replace-me',
                    client_secret: process.env.BACKEND_AUTH_CLIENT_SECRET ?? 'replace-me',
                    audience: BACKEND_API_AUDIENCE,
                }),
            };
    
            const response = await axios.request(options).then((data: any) => data.data);
            accessToken = response.access_token;
        }
        
        return accessToken!;
    }
}

// (async () => console.log(await BackendApiAuthService.getAccessToken()))();
