module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'es2020': true,
        'jest': true,
        'googleappsscript/googleappsscript': true,
    },
    'extends': ['eslint:recommended'],
    'parserOptions': {
        'ecmaVersion': 11,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'parser': '@typescript-eslint/parser',
    'plugins': ['@typescript-eslint', 'googleappsscript'],
    'rules': {
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'max-len': ['error', 120],
        'no-var': 'error',

        // vanilla indent rule is busted: https://github.com/typescript-eslint/typescript-eslint/issues/1824
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 4],

        // there can be errors because functions are used by the Google Apps Script sheet
        'no-unused-vars': 'off',
    },
};