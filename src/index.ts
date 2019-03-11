import axios from 'axios';

interface Ioption {
    isTrustUnSecureCert?: boolean; // default set to true
    serverUrl: string;
    timeout?: number;
}
enum eOperation {
    "login"
}

const debug = (log: string) => { process.env.DEBUG && console.log(log); };
/**
 * Tiny tiny rss client class
 */
export default class TtrssClient {
    private sessionId: string;
    apiLevel: number;
    serverUrl: string;
    timeout: number;
    private isTrustUnSecureCert: boolean;
    private userInfo: {user: string, password: string} = {user: "", password: ""};
    constructor({
        serverUrl,
        timeout = 2000,
        isTrustUnSecureCert = true,
    }: Ioption ) {
        debug(`init the class`);
        this.serverUrl = serverUrl;
        this.timeout = timeout;
        this.isTrustUnSecureCert = isTrustUnSecureCert;
    }
    public async login(username: string, password: string) {
        debug(`login...`);
        this.userInfo.user = username;
        this.userInfo.password = password;
        return await this._login();
    }
    private async _login() {
        debug(`__login...`);
        const result = await this.sendRequest("login", {
            user: this.userInfo.user,
            password: this.userInfo.password,
        }, false);
        return result;
    }
    public getVersion() {
    }
    private async sendRequest(operation: keyof typeof eOperation, data: object, needLogin = true): Promise<object> {
        // FIXME: '/' at the url end
        Object.assign(data, {op: operation});
        if (needLogin) {
            if (this.sessionId) {
                Object.assign(data, {session_id: this.sessionId});
            } else {
                debug("in to the request login hell");
                await this._login();
                return await this.sendRequest(operation, data, needLogin);
            }
        }
        debug(`send request: ${JSON.stringify(data)}`);
        try {
            const res = await axios.post(this.serverUrl + "/api/", data, {timeout: this.timeout});
            return res.data;
        } catch (e) {
            console.error("error occurred when ttrss client send request");
            throw new Error(e);
        }
    }
}
