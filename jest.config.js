module.exports = {
  clearMocks: true,

  moduleFileExtensions: ["ts", "js"],

  testPathIgnorePatterns: ["/.yalc/", "/data/", "/_helpers"],

  testEnvironment: "node",

  transformIgnorePatterns: ["<rootDir>/node_modules/(?!@assemblyscript/.*)"],
  testTimeout: 600_000,

  setupFilesAfterEnv: ["./jest.setup.ts"],
  globalSetup: "./jest.setup.ts",
  globalTeardown: "./jest.teardown.ts",
  transform: {
    "^.+\\.(ts|js)$": "ts-jest",
  },
};
