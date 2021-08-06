module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['/node_modules/', 'models', 'stuff', 'dist', 'src'],
    globals: {
        'ts-jest': {
            tsconfig: '__tests__/tsconfig.json',
        },
    },
};
