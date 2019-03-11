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
            console.log("In mock axios post");
        expect(data).toEqual({op: "login", user: "user", password: "admin"});
        return Promise.resolve({data: {"session_id": "xxx"}});
    });
    const ttrss = new TTRss({
            serverUrl: "127.0.0.1"
    });
    const res = await ttrss.login("user", "admin");
    expect(res).toEqual({"session_id": "xxx"});
});
});
