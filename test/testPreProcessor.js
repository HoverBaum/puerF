/**
    Test for bin/routePreProcessor.
*/

var path = require('path');
var helper = require('../bin/helper');
var fs = require('fs-extra');
module.exports = function(test, tmpPath) {

    //THe processor to test.
    var processor = require('../bin/routePreProcessor');

    test('Pre processing of routes', function(t) {

        //First clear the tmp folder.
        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);
        fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
        fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), path.join(__dirname, 'tmp', 'ftlRoutes.js'));
        fs.copySync(path.join(__dirname, 'assets', 'someJSON.json'), path.join(__dirname, 'tmp', 'data.json'));

        var config = {
            routesFile: path.join(__dirname, 'tmp', 'routes.js'),
            ftlRoutesFile: path.join(__dirname, 'tmp', 'ftlRoutes.js'),
            combinedFile: path.join(__dirname, 'tmp', 'allRoutes.js')
        }

        //Start the testing.
        bothFilled()

        //First the standard case
        function bothFilled() {
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'both files filled, combined file exists');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /test'], 'both files filled, combined file has routes file methods');
                t.ok(mod['GET /ftl'], 'both files filled, combined file has ftl methods');
                rightData();
            });
        }

        var fakeFM = {
            render: function(string, data, callback) {
                callback(null, data);
            }
        }

        //Make sure routs actually return the right data.
        function rightData() {
            var mod = helper.loadModule(config.combinedFile);
            var fakeRes = {
                writeHeader: function(){},
                end: function(){},
                write: function(data) {
                    t.ok(data.testOK, 'data for routes, plain data route is correct');
                    rightJSONData();
                }
            }
            mod['GET /ftl'](null, fakeRes, null, fakeFM);
        }

        function rightJSONData(){
            var mod = helper.loadModule(config.combinedFile);
            var fakeRes = {
                writeHeader: function(){},
                end: function(){},
                write: function(data) {
                    t.notOk(data.testOK, 'data for routes, JSON data is correct');
                    routesEmpty();
                }
            }
            mod['GET /json'](null, fakeRes, null, fakeFM);
        }

        //Test empty routes file
        function routesEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), config.routesFile);
            fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), path.join(__dirname, 'tmp', 'ftlRoutes.js'));
            fs.removeSync(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'routes empty, combined file exists');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /ftl'], 'routes empty, combined has ftl Components');
                t.notOk(mod['GET /test'], 'routes empty, combined does not have routes Components');
                ftlEmpty();
            });
        }

        //Test empty ftl File
        function ftlEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), config.ftlRoutesFile);
            fs.removeSync(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'ftl empty, combined file exists');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /test'], 'ftl empty, combined has routes Components');
                t.notOk(mod['GET /ftl'], 'ftl empty, combined does not have ftl Components');
                noRoutes();
            });
        }

        //Test with non existing routes file.
        function noRoutes() {
            fs.removeSync(path.join(__dirname, 'tmp', 'routes.js'));
            fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), config.ftlRoutesFile);
            fs.removeSync(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'routes don\'t exist, combined file exists');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /ftl'], 'routes don\'t exist, combined has ftl components');
                noFTL();
            });
        }

        //Test with ftl file not existing.
        function noFTL() {
            fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
            fs.removeSync(path.join(__dirname, 'tmp', 'ftlRoutes.js'));
            fs.removeSync(config.combinedFile);
            processor.process(config, function() {
                t.ok(fs.existsSync(config.combinedFile), 'ftlRoutes don\'t exist, combined file exists');
                var mod = helper.loadModule(config.combinedFile);
                t.ok(mod['GET /test'], 'ftlRoutes don\'t exist, combined has routes components');
                end();
            });
        }

        function end() {
            //fs.removeSync(tmpPath);
            t.end();
        }

    });

}
