var fs = require('fs');
var path = require('path');

/**
 *   Find all the templates we created as a hackaround and remove them.
 */
module.exports = function cleanTemplates(rootFolder, callback) {
	var root = path.resolve(process.cwd(), rootFolder);
	walk(root, function(err, templates) {
		var max = templates.length;
		var done = 0;
		templates.forEach(template => {
			fs.unlink(template, function() {
				done += 1;
				if(done === max) {
					callback();
				}
			});
		});
	});
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
					if(/_puerF\.ftl$/.test(file)) {
						results.push(file);
					}
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
