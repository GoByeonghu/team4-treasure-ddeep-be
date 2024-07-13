const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0'});

const options = {
    info: {
        title: 'Treasure DDeep API Document',
        description: '보물띱의 자동 생성 문서입니다.'
    },
    servers: [
        {
            url: 'http://localhost:3008'
        }
    ],
    schemes: ['http']
};

const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./app.js'];
swaggerAutogen(outputFile, endpointsFiles, options);