/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  // transform: {
  //   "^.+\\.(ts|tsx)$": [
  //     `ts-jest`,
  //     {
  //       isolatedModules: true,
  //     },
  //   ],
  // },
};
