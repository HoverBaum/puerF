/**
    Testing bin/initializer with various options.
*/

var path = require('path');
var fs = require('fs-extra');

module.exports = function(test, tmpPath) {

    //Create paths to files.
    var mockFolder = path.join(tmpPath, 'mock');
    var templateFolder = path.join(tmpPath, 'templates');

    var routesFile = path.join(mockFolder, 'routes.js');
    var ftlRoutesFile = path.join(mockFolder, 'ftlRoutes.js');
    var ftlFile = path.join(templateFolder, 'home.ftl');
    var dataFile = path.join(tmpPath, 'data', 'data.json');
    var homDataFile = path.join(tmpPath, 'data', 'home.json');
    var configFile = path.join(tmpPath, 'puerFConfig.js');

    var files = [routesFile, ftlRoutesFile, ftlFile, dataFile, homDataFile, configFile];

    test('Initialization script', function(t) {

        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        var initializer = require('../bin/initializer');
        var options = {
            root: tmpPath
        };

        //Fist basic setup, only set paths for files into tmp dir.
        initializer.init(options, function() {
            checkFiles();
        });

        //Make sure all files are present
        function checkFiles() {
            var all = files.length;
            var processed = 0;
            files.forEach(file => {
                fs.stat(file, function(err, stats) {
                   if(err) t.fail(`Basic setup check for ${file} failed ${err}`);
                   processed += 1;
                   if(all === processed) {
                       t.pass('Init script generates all expected files.');
                       end();
                   }
               });
            });
        }

        //END this test and clean up.
        function end() {
            fs.remove(tmpPath, function() {
                t.end();
            });
        }

    });

}
