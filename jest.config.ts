import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
	transform: {
		'\\.[t]sx?$': ['ts-jest', { useESM: true, tsconfig: './tests/tsconfig.json' }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs', 'json', 'node'],
	collectCoverageFrom: ['<rootDir>/src/**/!(index).{ts,tsx,js,jsx,cjs,mjs}'],
	extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
	testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx,cjs,mjs}'],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

export default jestConfig;
