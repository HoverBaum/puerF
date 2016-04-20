/**
    Test for bin/routePreProcessor.
*/

var path = require('path');
var helper = require('../bin/helper');
var logger = require('../bin/logger');
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

        var routesFilePath = path.join(__dirname, 'tmp', 'routes.js');
        var ftlRoutesFilePath = path.join(__dirname, 'tmp', 'ftlRoutes.js');
        var combinedFilePath = path.join(__dirname, 'tmp', 'allRoutes.js');

        var filePaths = [routesFilePath, ftlRoutesFilePath];

        //Start the testing.
        bothFilled()

        //First the standard case
        function bothFilled() {
            processor.process(filePaths, combinedFilePath, function() {
                t.ok(fs.existsSync(combinedFilePath), 'both files filled, combined file exists');
                var mod = helper.loadModule(combinedFilePath);
                t.ok(mod['GET /test'], 'both files filled, combined file has routes file methods');
                t.ok(mod['GET /ftl'], 'both files filled, combined file has ftl methods');
                rightData();
            });
        }

        //Test that normal puer routes have the right data after combining.
        function rightData() {
            var mod = helper.loadModule(combinedFilePath);
            var fakeRes = {
                writeHeader: function(){},
                end: function(){},
                send: function(data) {
                    t.ok(data.dataFound, 'data for puer routes, correct data send');
                    rightftlData()
                }
            }
            mod['GET /data'](null, fakeRes, null);
        }

        var fakeFM = {
            render: function(string, data, callback) {
                callback(null, data);
            }
        }

        //Make sure routs actually return the right data.
        function rightftlData() {
            var mod = helper.loadModule(combinedFilePath);
            var fakeRes = {
                writeHeader: function(){},
                end: function(){},
                write: function(data) {
                    t.ok(data.testOK, 'data for ftl routes, plain data route is correct');
                    rightJSONData();
                }
            }
            this.fm = fakeFM;
            this.fs = fs;
            this.logger = logger;
            mod['GET /ftl'].call(this, null, fakeRes, null);
        }

        function rightJSONData(){
            var mod = helper.loadModule(combinedFilePath);
            var fakeRes = {
                writeHeader: function(){},
                end: function(){},
                write: function(data) {
                    t.notOk(data.testOK, 'data for ftl routes, JSON data is correct');
                    routesEmpty();
                }
            }
            this.fm = fakeFM;
            this.fs = fs;
            this.logger = logger;
            mod['GET /json'].call(this, null, fakeRes, null);
        }

        //Test empty routes file
        function routesEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), routesFilePath);
            fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), path.join(__dirname, 'tmp', 'ftlRoutes.js'));
            fs.removeSync(combinedFilePath);
            processor.process(filePaths, combinedFilePath, function() {
                t.ok(fs.existsSync(combinedFilePath), 'routes empty, combined file exists');
                var mod = helper.loadModule(combinedFilePath);
                t.ok(mod['GET /ftl'], 'routes empty, combined has ftl Components');
                t.notOk(mod['GET /test'], 'routes empty, combined does not have routes Components');
                ftlEmpty();
            });
        }

        //Test empty ftl File
        function ftlEmpty() {
            fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
            fs.copySync(path.join(__dirname, 'assets', 'emptyModule.js'), ftlRoutesFilePath);
            fs.removeSync(combinedFilePath);
            processor.process(filePaths, combinedFilePath, function() {
                t.ok(fs.existsSync(combinedFilePath), 'ftl empty, combined file exists');
                var mod = helper.loadModule(combinedFilePath);
                t.ok(mod['GET /test'], 'ftl empty, combined has routes Components');
                t.notOk(mod['GET /ftl'], 'ftl empty, combined does not have ftl Components');
                noRoutes();
            });
        }

        //Test with non existing routes file.
        function noRoutes() {
            fs.removeSync(path.join(__dirname, 'tmp', 'routes.js'));
            fs.copySync(path.join(__dirname, 'assets', 'ftlRoutes.js'), ftlRoutesFilePath);
            fs.removeSync(combinedFilePath);
            processor.process(filePaths, combinedFilePath, function() {
                t.ok(fs.existsSync(combinedFilePath), 'routes don\'t exist, combined file exists');
                var mod = helper.loadModule(combinedFilePath);
                t.ok(mod['GET /ftl'], 'routes don\'t exist, combined has ftl components');
                noFTL();
            });
        }

        //Test with ftl file not existing.
        function noFTL() {
            fs.copySync(path.join(__dirname, 'assets', 'routes.js'), path.join(__dirname, 'tmp', 'routes.js'));
            fs.removeSync(path.join(__dirname, 'tmp', 'ftlRoutes.js'));
            fs.removeSync(combinedFilePath);
            processor.process(filePaths, combinedFilePath, function() {
                t.ok(fs.existsSync(combinedFilePath), 'ftlRoutes don\'t exist, combined file exists');
                var mod = helper.loadModule(combinedFilePath);
                t.ok(mod['GET /test'], 'ftlRoutes don\'t exist, combined has routes components');
                end();
            });
        }

        function end() {
            fs.removeSync(tmpPath);
            t.end();
        }

    });

}
