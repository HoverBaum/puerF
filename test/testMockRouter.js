/**
    Test bin/puerMockRouter
*/

module.exports = function(test) {

    test('Lookup object for mock routes', function(t) {

        var mock = require('../bin/puerMockRouter');
        var config = require('./assets/routesConfig');

        var mocked = mock(config);
        t.ok(mocked['get'].get('/'), 'GET is pressent');
        t.ok(mocked['put'].get('/'), 'PUT is present');
        t.ok(mocked['delete'].get('/'), 'DELTE is present');
        t.ok(mocked['post'].get('/'), 'POST is present');

        t.throws(mocked['get'].get('/test'), new Error('Test error'), 'Function calles return the right things');

        t.end();
    });

}
