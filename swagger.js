const swaggerAutogen = require('swagger-autogen')();

const doc = {
  swagger: '2.0',
  info: {
    title: 'Marvel Characters API',
    description: 'API for Marvel Comics and MCU characters',
    version: '1.0.0'
  },
  host: process.env.HOST || 'localhost:5050',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './server.js',
  './routes/characters.js',
  './routes/movies.js',
  './routes/comics.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);