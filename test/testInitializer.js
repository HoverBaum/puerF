/**
    Testing bin/initializer with various options.
*/

var path = require('path');
var fs = require('fs-extra');

module.exports = function(test) {

    var tmpPath = path.join(__dirname, 'tmp');
    var mockFolder = path.join(tmpPath, 'mock');
    var templateFolder = path.join(tmpPath, 'teampltes');
    var routesFile = path.join(tmpPath, 'routes.js');
    var ftlFile = path.join(tmpPath, 'ftlRoutes.js');

    test('Initialization script', function() {

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
                t.ok(stats.isFile(), 'Basic init routes exist');
                fs.stat(ftlFile, function(err, stats) {
                    if(err) t.fail(`Basic setup check for ftlRoutes failed ${err}`);
                    t.ok(stats.isFile(), 'Basic init ftlRoutes exist');
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
                    if(err) t.fail(`noMock setup check for routes failed ${err}`);
                    t.notOk(stats.isFile(), 'noMock init routes exist');
                    fs.stat(ftlFile, function(err, stats) {
                        if(err) t.fail(`noMock setup check for ftlRoutes failed ${err}`);
                        t.ok(stats.isFile(), 'noMock init ftlRoutes exist');
                        noTemplate();
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
                    if(err) t.fail(`noTemplate setup check for routes failed ${err}`);
                    t.ok(stats.isFile(), 'noTeamplte init routes exist');
                    fs.stat(ftlFile, function(err, stats) {
                        if(err) t.fail(`noTemplate setup check for ftlRoutes failed ${err}`);
                        t.notOk(stats.isFile(), 'noTemplate init ftlRoutes exist');
                        t.end();
                    });
                });
            });
        }

    });

}
