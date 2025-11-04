import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: false,
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;


