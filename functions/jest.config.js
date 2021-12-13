module.exports = {
    'preset': 'ts-jest',
    'testMatch': [
        '<rootDir>/src/tests/**/*.test.*'
    ],
    'moduleDirectories': [
        'src',
        'node_modules'
    ],
    'globals': {
        'ts-jest': {
            'isolatedModules': true
        }
    }
};