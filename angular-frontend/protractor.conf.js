exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./e2e/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'firefox'
  },
  baseUrl: 'http://localhost:4200/',
  onPrepare() {
  }
};
