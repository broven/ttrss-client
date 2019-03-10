const base = require('./jest.base');
module.exports = {
    ...base,
    testPathIgnorePatterns: [
        "/node_modules/",
        "/test/real"
    ]
}
