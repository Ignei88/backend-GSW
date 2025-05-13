export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testTimeout: 30000,
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Informe de Pruebas",
      outputPath: "./reports/test-report.html"
    }]
  ]
};