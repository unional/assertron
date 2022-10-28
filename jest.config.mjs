export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    '<rootDir>/ts/**/*.[jt]s'
  ],
  roots: [
    '<rootDir>/ts',
  ],
  transform: {
    // '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    '^.+\\.(ts|tsx|mts|cts)$': ['ts-jest', {
      isolatedModules: true,
      useESM: true,
    }]
  },
  testMatch: ['**/?(*.)+(spec|test|integrate|accept|system|unit).[jt]s?(x)'],
  watchPlugins: [
    'jest-watch-suspend',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' },
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' },
    ],
  ],
}
