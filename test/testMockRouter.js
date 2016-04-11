/**
    Test bin/puerMockRouter

    Interface tested:
    mock()
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

        t.throws(mocked['get'].get('/test'), new Error('Test error'), 'Function calls return the right things');
        t.throws(mocked['post'].get('/postTest'), new Error('POST error'), 'Function are different from one another');

        t.end();
    });

}
