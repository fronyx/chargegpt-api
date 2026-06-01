module.exports = {
  displayName: 'charge-gpt',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
  coverageDirectory: '../../coverage/apps/charge-gpt',
};
