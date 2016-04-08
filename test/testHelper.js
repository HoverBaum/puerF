/**
    Testing bin/helper.js

    Interface tested:
    loadModule: loadModuleWithoutCache,
    guarantyFolder: makeSureFolderExists,
    absolutePath: getAbsolutePath
*/

var path = require('path');
var fs = require('fs-extra');
var helper = require('../bin/helper');
module.exports = function(test) {

    var tmpPath = path.join(__dirname, 'tmp');

    test('Testing helper', function(t) {

        //First clear the tmp folder.
        if(fs.existsSync(tmpPath)) fs.removeSync(tmpPath);

        //Guaranty folder
        helper.guarantyFolder(tmpPath);
        t.ok(fs.existsSync(tmpPath), 'Creates folders');
        var pathToFile = path.join(tmpPath, 'tstFolder', 'file.txt');
        var pathToFolder = path.join(tmpPath, 'tstFolder');
        helper.guarantyFolder(pathToFile);
        t.ok(fs.existsSync(pathToFolder), 'Creates folder when given file path');

        //Absolute path
        var uri = './test';
        var uriShould = path.resolve(process.cwd(), uri);
        t.equal(helper.absolutePath(uri), uriShould, 'Resolves path to absolute relative to cwd');

        //Loading of modules
        var testPath = path.join(__dirname, 'assets', 'testModule.js');
        var changedTestPath = path.join(__dirname, 'assets', 'testModuleChanged.js');
        var tmpTestPath = path.join(__dirname, 'tmp', 'testModule.js');
        fs.copySync(testPath, tmpTestPath);
        var mod = helper.loadModule(tmpTestPath);
        t.equal(mod.name, 'Tester', 'Loades the right module');
        fs.copySync(changedTestPath, tmpTestPath);
        var mod = helper.loadModule(tmpTestPath);
        t.ok(mod.changed, 'Loades the changed module');


        //Cleanup after ourselfes.
        fs.removeSync(tmpPath);

        t.end();

/*
        loadModule: loadModuleWithoutCache,
*/
    });



}
