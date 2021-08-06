module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['/node_modules/', 'models', 'stuff'],
    globals: {
        'ts-jest': {
            tsconfig: '__tests__/tsconfig.json',
        },
    },
};
