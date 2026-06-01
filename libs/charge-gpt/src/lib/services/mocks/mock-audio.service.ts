export class MockAudioService {
    async text2Speech(): Promise<string> {
        return Promise.resolve('');
    }
}
