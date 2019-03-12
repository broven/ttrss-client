import axios from 'axios';

import resInterface from '../typings/response';

interface Ioption {
    isTrustUnSecureCert?: boolean; // default set to true
    serverUrl: string;
    timeout?: number;
}
interface Iresponse {
    seq: number;
    status: number;
    content: object;
}
enum eOperation {
    "login",
    "unsubscribeFeed",
    "subscribeToFeed",
    "getCategories"
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
    /**
     * @param username
     * @param password
     */
    public async login(username: string, password: string): Promise<boolean> {
        debug(`login...`);
        this.userInfo.user = username;
        this.userInfo.password = password;
        const { session_id } = await this._login();
        this.sessionId = session_id
        if (this.sessionId) return true;
        return false;
    }
    private async _login() {
        debug(`__login...`);
        if (!this.userInfo.user && !this.userInfo.password) {
            console.error('please login before you use this API.');
            throw new Error('can\'t login');
        }
        const result = await this.sendRequest<resInterface.Ilogin>("login", {
            user: this.userInfo.user,
            password: this.userInfo.password,
        }, false);
        return result;
    }
    public getApiLevel() {}
    public getVersion() {}
    public logout() {}
    public isLoggedIn() {}
    public getUnread() {}
    public getCounters() {}
    public getFeeds() {}

    /**
     * Returns JSON-encoded list of categories with unread counts.
     * @param unread_only - only return categories which have unread articles
     * @param enable_nested - switch to nested mode, only returns topmost categories requires version:1.6.0
     * @param include_empty  - include empty categories requires version:1.7.6
     */
    public async getCategories(unread_only: boolean, enable_nested: boolean, include_empty: boolean) {
        const result = await this.sendRequest<resInterface.IgetCategories>("getCategories", {
            unread_only,
            enable_nested,
            include_empty
        });
        return result;
    }
    public getHeadlines() {}
    public updateArticle() {}
    public getArticle() {}
    public getConfig() {}
    public updateFeed() {}
    public getPref() {}
    public catchupFeed() {}
    public getLabels() {}
    public setArticleLabel() {}
    public shareToPublished() {}
    /**
     * subcribeFeed
     * @description this api is a little different form the api, you need call login before this api called.
     * @param feed_url - as it is
     * @param category_id - as it is
     * @returns feed_id - if success return feed_id else return null
     */
    public async subscribeToFeed(feed_url: string, category_id = 0) {
        const res = await this.sendRequest('subscribeToFeed', {
            feed_url,
            category_id,
            ...this.userInfo
        });
        const {status: {feed_id}} = <any>res;
        if(feed_id) return feed_id;
        return null;
    }

    /**
     * @param feed_id - Feed id to unsubscribe from
     */
    public async unsubscribeFeed(feed_id: string) {
        return await this.sendRequest('unsubscribeFeed', {
            feed_id
        });
    }
    public getFeedTree() {}
    private async sendRequest<T = object>(operation: keyof typeof eOperation, data: object, needLogin = true): Promise<T> {
        // FIXME: '/' at the url end
        Object.assign(data, {op: operation});
        if (needLogin) {
            if (this.sessionId) {
                Object.assign(data, {sid: this.sessionId});
            } else {
                debug("in to the request login hell");
                await this._login();
                return await this.sendRequest(operation, data, needLogin);
            }
        }
        debug(`send request: ${JSON.stringify(data)}`);
        try {
            const res = await axios.post(this.serverUrl + "/api/", data, {timeout: this.timeout});
            return res.data.content;
        } catch (e) {
            console.error("error occurred when ttrss client send request");
            throw new Error(e);
        }
    }
}
