import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // extensions des fichiers test
  moduleFileExtensions: ['js', 'json', 'ts'],
  // dossier racine pour Jest
  rootDir: 'src',
  // regex pour reconnaître les fichiers test
  testRegex: '.*\\.spec\\.ts$',
  // transformer les fichiers TS via ts-jest
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // coverage
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // map les alias TypeScript (tsconfig.json)
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
};

export default config;
