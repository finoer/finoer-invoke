const pkg = require('./package.json')
const libraryName = pkg.name

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts}"
  ],  
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/",
    `src/${libraryName}.ts`
  ],
  rootDir: './',
  moduleNameMapper: {
    "^@root/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1"
  },
  testEnvironment: "jest-environment-jsdom",
  setupFiles: [
    "jest-canvas-mock"
  ],
  globals: {}
}