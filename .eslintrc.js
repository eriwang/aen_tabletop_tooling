module.exports = {
    'extends': ['eslint:recommended'],
    'parserOptions': {
        'ecmaVersion': 11,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'rules': {
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'max-len': ['error', 120],
        'no-var': 'error',

        'space-infix-ops': 'error',
        'spaced-comment': 'error',
        'keyword-spacing': 'error',
        'space-in-parens': 'error',
        'space-before-blocks': 'error',
    },
    'ignorePatterns': ['**/dist/**'],
};