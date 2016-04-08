/**
    Testing bin/initializer with various options.
*/

var path = require('path');
var fs = require('fs-extra');

module.exports = function(test) {

    var tmpPath = path.join(__dirname, 'tmp');
    var mockFolder = path.join(tmpPath, 'mock');
    var templateFolder = path.join(tmpPath, 'templates');
    var routesFile = path.join(mockFolder, 'routes.js');
    var ftlRoutesFile = path.join(mockFolder, 'ftlRoutes.js');
    var ftlFile = path.join(templateFolder, 'test.ftl');

    test('Initialization script', function(t) {

        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        var initializer = require('../bin/initializer');
        var options = {
            mockFolder: mockFolder,
            templateFolder: templateFolder
        }

        //Fist basic setup, only set paths for files into tmp dir.
        initializer.init(options, function() {
            fs.stat(routesFile, function(err, stats) {
                if(err) t.fail(`Basic setup check for routes failed ${err}`);
                t.ok(stats.isFile(), 'Basic init, routes exist');
                fs.stat(ftlRoutesFile, function(err, stats) {
                    if(err) t.fail(`Basic setup check for ftlRoutes failed ${err}`);
                    t.ok(stats.isFile(), 'Basic init, ftlRoutes exist');
                    noMock();

                });
            });
        });

        //Check noMock option works
        function noMock() {
            fs.removeSync(tmpPath);
            options.noMock = true;
            initializer.init(options, function() {
                fs.stat(routesFile, function(err, stats) {
                    t.notOk(stats, 'noMock init, routes don\'t exist');
                    fs.stat(ftlRoutesFile, function(err, stats) {
                        t.notOk(stats, 'noMock init, ftlRoutes don\'t exist');
                        fs.stat(ftlFile, function(err, stats) {
                            t.ok(stats.isFile(), 'noMock init, template does exist');
                            noTemplate();
                        });
                    });
                });
            });
        }

        //Check noTemplates works
        function noTemplate() {
            fs.removeSync(tmpPath);
            options.noMock = false;
            options.noTemplate = true;
            initializer.init(options, function() {
                fs.stat(routesFile, function(err, stats) {
                    t.ok(stats.isFile(), 'noTeamplte init, routes exist');
                    fs.stat(ftlFile, function(err, stats) {
                        t.notOk(stats, 'noTemplate init, ftlRoutes don\'t exist');
                        t.end();
                    });
                });
            });
        }

    });

}
