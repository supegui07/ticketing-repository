module.exports = {
  preset: "ts-jest",
  testEnviroment: "node",
  setupFilesAfterEnv: [
    "./src/test/setup.ts"
  ]
}