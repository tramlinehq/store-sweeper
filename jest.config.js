/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(google-play-scraper|ramda)/)",
    "/vendor/(?!(google-play-scraper)/)",
  ],
  transform: {
    "^.+\\.(ts|js)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
