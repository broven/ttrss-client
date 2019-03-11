import TTRSS from '../../src/index';

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
