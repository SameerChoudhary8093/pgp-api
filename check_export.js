const app = require('./dist/src/main');
console.log('Exports keys:', Object.keys(app));
console.log('Has default export:', !!app.default);
