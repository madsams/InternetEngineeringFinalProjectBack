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
        "node/exports-style": ["warning", "module.exports"],
        "node/file-extension-in-import": ["warning", "always"],
        "node/prefer-global/buffer": ["warning", "always"],
        "node/prefer-global/console": ["warning", "always"],
        "node/prefer-global/process": ["warning", "always"],
        "node/prefer-global/url-search-params": ["warning", "always"],
        "node/prefer-global/url": ["warning", "always"],
        "node/prefer-promises/dns": "warning",
        "node/prefer-promises/fs": "warning"
    }
};
