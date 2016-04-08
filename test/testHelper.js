var path = require('path');
var fs = require('fs-extra');
var helper = require('../bin/helper');
module.exports = function(test) {

    var tmpPath = path.join(__dirname, 'tmp');

    test('Testing helper functions', function(t) {

        //First clear the tmp folder.
        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        helper.guarantyFolder(tmpPath);
        t.ok(fs.existsSync(tmpPath), 'Creates folders');

        var pathToFile = path.join(tmpPath, 'tstFolder', 'file.txt');
        var pathToFolder = path.join(tmpPath, 'tstFolder');
        helper.guarantyFolder(pathToFile);
        t.ok(fs.existsSync(pathToFolder), 'Creates folder when given file path');

        //Cleanup after ourselfes.
        fs.removeSync(tmpPath);

        t.end();

/*
        loadModule: loadModuleWithoutCache,
        guarantyFolder: makeSureFolderExists,
        absolutePath: getAbsolutePath
*/
    });

}
