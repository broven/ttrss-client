const base = require('./jest.config');
module.exports = {
    ...base,
    testPathIgnorePatterns: [
        "/node_modules/",
        "/test/real"
    ]
}
