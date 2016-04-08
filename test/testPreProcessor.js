/**
    Test for bin/routePreProcessor.
*/

var path = require('path');
module.exports = function(test) {

    var processor = require('../bin/routePreProcessor');

    test('Pre processing of routes', function(t) {

        var config = {
            routesFile: 'assets/routes.js',
            ftlRoutesFile: 'assets/ftlRoutes.js',
            combined: 'tmp/allRoutes.js'
        }

        processor.process(config, function() {
            t.end();
        });

    });

}
