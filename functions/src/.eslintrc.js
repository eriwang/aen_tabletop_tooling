module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'es2020': true,
        'jest': true,
    },
    'parser': '@typescript-eslint/parser',
    'plugins': ['@typescript-eslint'],
    'rules': {
        // some vanilla rules are busted
        'indent': 'off',
        '@typescript-eslint/indent': ['error', 4],

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
    },
    'ignorePatterns': ['functions/dist/**'],
};