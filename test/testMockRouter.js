/**
    Test bin/puerMockRouter

    Interface tested:
    mock()
*/

module.exports = function(test) {

    test('Lookup object for mock routes', function(t) {

        var mock = require('../bin/puerMockRouter');
        var config = require('./assets/routesConfig');

        mock.configure(config);
        t.ok(mock.lookUp('/', 'get'), 'GET is pressent');
        t.ok(mock.lookUp('/', 'put'), 'PUT is present');
        t.ok(mock.lookUp('/', 'delete'), 'DELTE is present');
        t.ok(mock.lookUp('/', 'post'), 'POST is present');


        t.throws(mock.lookUp('/test', 'get').call, new Error('Test error'), 'Function calls return the right things');
        //t.throws(mocked['get'].get('/test'), new Error('Test error'), 'Function calls return the right things');

        t.throws(mock.lookUp('/postTest', 'post').call, new Error('POST error'), 'Function are different from one another');
    //    t.throws(mocked['post'].get('/postTest'), new Error('POST error'), 'Function are different from one another');

        t.end();
    });

}
