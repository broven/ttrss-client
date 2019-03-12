import TTRSS from '../../src/index';
import { IgetCategories } from '../../typings/response';

const feed_url = 'https://rsshub.app/rsshub/rss'

const dotenv = require("dotenv");
dotenv.config();
const requiredParams = [
    "TT_PASSWORD",
    "TT_USER",
    "TTRSS_SERVER"
];

describe("basic test", () => {
    test("env config", () => {
        requiredParams.forEach((item) => {
            expect(process.env[item]).not.toBeUndefined;
        });
    });
    test("login", async () => {
        const ttrss = new TTRSS({
            serverUrl: process.env[requiredParams[2]]
        });
        const result = await ttrss.login(
            process.env[requiredParams[1]],
            process.env[requiredParams[0]]
        );
        expect(result).not.toBeUndefined;
        expect(result).toBeTruthy();
    });
    test("login failed", async () => {
        const ttrss = new TTRSS({
            serverUrl: process.env[requiredParams[2]]
        });
        const result = await ttrss.login(
            'asdfadsfasf',
            'asdfsdafsadfsdaf'
        );
        expect(result).toBeFalsy();
    });
});
describe('apis', () => {
    const ttrssInstance = new TTRSS({
        serverUrl: process.env['TTRSS_SERVER'],
        timeout: 10000
    });
    const testFeedUrl = 'https://rsshub.app/rsshub/rss';
    beforeAll(async () => {
        jest.setTimeout(20000);
        await ttrssInstance.login(
            process.env[requiredParams[1]],
            process.env[requiredParams[0]]
        );
    });
    test('getCategories', async () => {
        const res = await ttrssInstance.getCategories(false, true, true);
        expect(res).toHaveProperty('length');
        (<Array<object>>res).forEach(item => {
            expect(item).toHaveProperty('id')
            expect(item).toHaveProperty('title')
        });
    });
    test('subscribe&unsubscribe', async () => {
        const feed_id = await ttrssInstance.subscribeToFeed(testFeedUrl);
        expect(feed_id).not.toBeNull();
        const res = await ttrssInstance.unsubscribeFeed(feed_id);
        console.log(JSON.stringify(res));
    });
})
