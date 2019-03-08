interface Ioption {
    isTrustUnSecureCert?: boolean; // default set to true
    serverUrl: number;
}



class TtrssClient {
    sessionId: string;
    apiLevel: number;
    serverUrl: number;
    isTrustUnSecureCert: boolean;
    constructor(option: Ioption ) {

    }
    public login() {

    }
}