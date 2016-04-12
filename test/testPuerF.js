/**
    Test for bin/puerF.

    As to not polute space with failing tests we are not Testing
    the std Options for folders or the opening of a browser!
*/

var path = require('path');
var fs = require('fs-extra');
var request = require('request');
module.exports = function(test, tmpPath) {

    test.skip('puerF exported module', function(t) {

        //Remove tmp folder if it is there.
        if (fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        //puerF core module.
        var puerf = require('../bin/puerf');

        //Some paths for temporary files.
        var mockFolderPath = path.join(tmpPath, 'mock');
        var templateFolderPath = path.join(tmpPath, 'templates');
        var routesFile = path.join(mockFolderPath, 'routes.js');
        var ftlRoutesFile = path.join(mockFolderPath, 'ftlRoutes.js');
        var combinedFile = path.join(mockFolderPath, 'combined.js');
        var testPort = '8057';

        testpuerF();

        //Test that it runs the init script.
        function initScript() {
            puerf.init({
                mockFolder: mockFolderPath,
                templateFolder: templateFolderPath
            }, function() {
                fs.stat(mockFolderPath, function(err, stat) {
                    t.ok(stat, 'init script created files');
                    testpuerF();
                });
            });
        }

        //Test if puerF does the right things with handed options.
        function testpuerF() {
            fs.copySync(path.join(__dirname, 'assets', 'someJSON.json'), path.join(__dirname, 'tmp', 'someJSON.json'));
            puerf.start({
                freemarker: ftlRoutesFile,
                mock: routesFile,
                combined: combinedFile,
                templates: templateFolderPath,
                port: testPort,
                root: tmpPath,
                noBrowser: true
            }, testFileServing);
        }

        //Test if we get the file served via http.
        function testFileServing() {
            var req = request(`http://127.0.0.1:${testPort}/someJSON.json`, {
                timeout: 1000
            }, function(error, response, body) {
                if (error || response.statusCode !== 200) {
                    t.fail('Bad request to static server');
                } else {
                    t.ok(JSON.parse(body).theFile, 'The right file was server');
                }
                req.abort();
                end();
            });
        }

        //End this test.
        function end() {
            console.log('now closing');
            puerf.close(function() {
                t.end();
            })

        }

    });

}
