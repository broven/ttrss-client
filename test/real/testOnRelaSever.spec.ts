import * as dotenv from 'dotenv';

dotenv.config();
const requiredParams = [
    "TT_PASSWORD",
    "TT_USER",
    "TTRSS_SERVER"
];
const isSatifyed = requiredParams.every((item) => {
    if (process.env[item]) return true;
    return false;
});
