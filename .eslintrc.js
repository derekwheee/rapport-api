module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "@hapi/eslint-config-hapi"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "brace-style": [1, "1tbs"],
        "comma-dangle": 0,
        "eol-last": 0,
    }
};