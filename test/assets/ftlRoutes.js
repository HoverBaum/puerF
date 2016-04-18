module.exports = {
    'GET /ftl': {
        template: 'test',
        data: {
            testOK: true,
            name: 'Tester'
        }
    },
    'GET /json': {
        template: 'test',
        jsonFile: './data.json'
    }
}
