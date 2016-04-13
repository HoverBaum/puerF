/**
    Test bin/puerMockRouter
*/

module.exports = function(test) {

    test('Lookup object for mock routes', function(t) {

        var mock = require('../bin/puerMockRouter');
        var config = require('./assets/routesConfig');

        //Test that all routes were added.
        mock.configure(config);
        t.ok(mock.lookUp('/', 'get'), 'GET is pressent');
        t.ok(mock.lookUp('/', 'put'), 'PUT is present');
        t.ok(mock.lookUp('/', 'delete'), 'DELTE is present');
        t.ok(mock.lookUp('/', 'post'), 'POST is present');

        t.throws(mock.lookUp('/', 'get').call, new Error('Got home'), 'Looking up home works');

        //Make sure functions are the right ones.
        t.throws(mock.lookUp('/test', 'get').call, new Error('Test error'), 'Function calls return the right things');
        t.throws(mock.lookUp('/postTest', 'post').call, new Error('POST error'), 'Function are different from one another');

        //Finally chek parameters are handled right.
        var info = mock.lookUp('/user/1234/username', 'get');
        t.ok(info.paramValues.id, 'Parameter routes, paramter exists');
        t.equal(info.paramValues.id, '1234', 'Paramter routes, paramteres have the expected values');
        t.equal(info.paramValues.name, 'username', 'Paramter routes, different paramteres have the expected values');

        //Test that we can register routes of different depth.
        var challow = mock.lookUp('/user/12345', 'get');
        t.ok(challow.paramValues.id, 'challow route, works as well');
        t.equal(challow.paramValues.id, '12345', 'challow route, has right paramValue');

        //Make sure unexisting routes are undefined
        var notThere = mock.lookUp('/this/route/does/not/exist/for/sure', 'get');
        t.equal(notThere, undefined, 'Non existing routes are undefined');

        //Check that routes can be without the / at the beginning/
        var wrongInput = mock.lookUp('lala', 'get');
        t.equal(wrongInput, undefined, 'Gradually fail input without / to undefined')

        t.end();
    });

}
