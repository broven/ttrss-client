import axios, { AxiosStatic } from 'axios';

import TTRss from '../../src/index';

jest.mock("axios");

describe("Base class", () => {
test("default export should not be undefined", () => {
    expect(TTRss).not.toBeUndefined();
});
});
describe("login", () => {
test("login", async () => {
    (<jest.Mock>axios.post).mockImplementation((url, data, option) => {
        expect(data).toEqual({op: "login", user: "user", password: "admin"});
        return Promise.resolve({data: {
            "seq": 0,
            "status": 0,
            "content": {
                "session_id": "j8modrj23e1n7qnepg0t3gcp2p",
                "api_level": 14
            }
        }});
    });
    const ttrss = new TTRss({
            serverUrl: "127.0.0.1"
    });
    const res = await ttrss.login("user", "admin");
    expect(res).toEqual(true);
});
});
