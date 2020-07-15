module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "plugin:node/recommended",
        "plugin:security/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2020
    },
    "rules": {
        "node/exports-style": ["warn", "module.exports"],
        "node/file-extension-in-import": ["warn", "always"],
        "node/prefer-global/buffer": ["warn", "always"],
        "node/prefer-global/console": ["warn", "always"],
        "node/prefer-global/process": ["warn", "always"],
        "node/prefer-global/url-search-params": ["warn", "always"],
        "node/prefer-global/url": ["warn", "always"],
        "node/prefer-promises/dns": "warn",
        "node/prefer-promises/fs": "warn"
    }
};
