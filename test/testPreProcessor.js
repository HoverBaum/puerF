/**
    Test for bin/routePreProcessor.
*/

var path = require('path');
var helper = require('../bin/helper');
var fs = require('fs-extra');
module.exports = function(test) {

    var tmpPath = path.join(__dirname, 'tmp');
    var processor = require('../bin/routePreProcessor');

    test('Pre processing of routes', function(t) {

        //First clear the tmp folder.
        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);
        fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
        fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), path.join(__dirname, 'tmp', 'ftlRoutes.js'));

        var config = {
            routesFile: path.join(__dirname, 'tmp', 'routes.js'),
            ftlRoutesFile: path.join(__dirname, 'tmp', 'ftlRoutes.js'),
            combinedFile: path.join(__dirname, 'tmp', 'allRoutes.js')
        }

        //First the standard case
        processor.process(config, function() {
            t.ok(fs.existsSync(config.combinedFile), 'Combined file exists');
            var mod = helper.loadModule(config.combinedFile);
            var value = mod['GET /test'] && mod['GET /ftl'];
            t.ok(value, 'Combined file has methods from both files');
            routesEmpty();
        });

        //Test empty routes file
        function routesEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), config.routesFile);
            fs.remove(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'Combined file exists with empty routes');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /ftl'], 'File has ftl Components');
                t.notOk(mod['GET /test'], 'File does not have routes Components');
                ftlEmpty();
            });
        }

        //Test empty ftl File
        function ftlEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), config.ftlRoutesFile);
            fs.remove(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'Combined file exists with empty ftlRoutes file');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /test'], 'File has routes Components');
                t.notOk(mod['GET /ftl'], 'File does not have ftl Components');
                noRoutes();
            });
        }

        //Test with non existing routes file.
        function noRoutes() {
            t.end();
        }

    });

}
