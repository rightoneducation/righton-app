// Minimal placeholder to satisfy API clients until Amplify auth is wired
export class AuthApiClient {
    isUserAuth: boolean;
    constructor() {
        this.isUserAuth = false;
    }
    async verifyAuth(): Promise<boolean> {
        return this.isUserAuth;
    }
}