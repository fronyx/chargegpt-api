import { authenticate } from './auth-lib';

export async function handler(event: any): Promise<any> {
    return authenticate(event);
}
