/**
 *   Converts freemarker routes to static HTML pages.
 *
 *   @module converter
 */

var logger = require('./logger');
var helper = require('./helper');
var Freemarker = require('freemarker.js');
var fs = require('fs');
var path = require('path');

module.exports = function convertTemplates(routesFile, ftlRoot, targetFolder) {

	logger.info(`Now converting FreeMarker routes in "${routesFile}" to static HTML in "${targetFolder}"`);
	var absRoutesFile = helper.absolutePath(routesFile);
	helper.guarantyFolder(helper.absolutePath(targetFolder));
	var routes = require(absRoutesFile);
	var fm = new Freemarker({
		viewRoot: helper.absolutePath(ftlRoot)
	});
	var toProcess = [];
	for(route in routes) {
		if(routes[route].template) {
			toProcess.push(route);
		}
	}
	var max = toProcess.length;
	var processed = 0;
	logger.info(`Found ${max} ${max === 1 ? 'route' : 'routes'} to process.`)
	toProcess.forEach(route => {
		convertRoute(routes[route], fm, absRoutesFile, function(html) {
			saveHtml(routes[route], html, helper.absolutePath(targetFolder), function() {
				processed += 1;
				logger.info(`Processed ${processed}/${max} - ${routes[route].template}`);
				if(processed === max) {
					logger.info(`Finished converting all templates in routes file.`);
				}
			});
		});
	});
}

function convertRoute(route, fm, absRoutesFile, callback) {
	var ftlData = route.jsonFile ? require(path.resolve(path.dirname(absRoutesFile), route.jsonFile)) : route.data;
	fm.render(route.template, ftlData, function(err, data, out) {
		if(/.+DONE.+/.test(out)) {
			logger.debug('FreeMarker said', out);
		} else {
			logger.warn('FreeMarker said', out);
		}
		if(err) {
			throw err;
		}
		callback(data);
	});
}

function saveHtml(route, html, targetFolder, callback) {
	var htmlPath = route.template.replace(/ftl$/, 'html');
	var destination = path.join(targetFolder, htmlPath);
	fs.writeFile(destination, html, callback);
}
