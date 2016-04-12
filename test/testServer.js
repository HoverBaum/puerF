var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs-extra');
var path = require('path');

module.exports = function(test, tmpPath) {

//NOTE Server is not corretly closing down right now....

//TODO test routes that have /:something to see if that is setup right.

    test.skip('Server for mocks and static files', function(t) {

        //Remove tmp folder if it is there.
        if (fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        var serverStarter = require('../bin/puerServer');
        var mockFolderPath = path.join(tmpPath, 'mock');
        var templateFolderPath = path.join(tmpPath, 'templates');
        var combinedFile = path.join(mockFolderPath, 'combined.js');
        var testPort = '8057';
        var testJSONFile = path.join(tmpPath, 'test.json');

        //Copy over some files to test things with.
        fs.copySync(path.join(__dirname, 'assets', 'allMock.js'), combinedFile);
        fs.copySync(path.join(__dirname, 'assets', 'someJSON.json'), testJSONFile);

        //Start the server with some test config.
        var server = serverStarter(combinedFile, {
            port: testPort,
            dir: tmpPath,
            browser: false,
            templatesPath: templateFolderPath
        }, firstTest);

        //Check that initially we get the right page rendered.
        function firstTest() {
            request(`http://127.0.0.1:${testPort}/`, function(error, response, html) {
                t.equal(error, null, 'No error loading website');
                //t.equal(response.statusCode, 200, 'Side loading okay');
                if (!error && response.statusCode == 200) {
                    /*var $ = cheerio.load(html);
                    var str = $('#test').html();
                    t.equal(str, 'Tester', 'FTL template got rendered with correct data');*/
                    end();
                } else {
                    console.log('here 404');
                    end();
                }
            });
        }

        //Checks that changed data renders a different website.
        function changedFile() {
            fs.copySync(path.join(__dirname, 'assets', 'allMockChanged.js'), combinedFile);
            server.updateRoutes(function() {
                request(`http://127.0.0.1:${testPort}/`, function(error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        var str = $('#test').html();
                        t.equal(str, 'Tester2', 'FTL template got rendered with changed data');
                        end();
                    }
                });
            });
        }

        //Checks a normal route.
        function normalRoute() {

        }

        function end() {
            server.close(function() {
                t.end();
            });
        }

    });

}
