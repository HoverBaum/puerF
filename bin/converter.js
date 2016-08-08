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

/**
 *   Convert all templates within a routes file.
 *   @param  {String} routesFile   - Path to routes file relative to current working directory.
 *   @param  {String} ftlRoot      - Root folder for FTL templates in the routes File.
 *   @param  {String} targetFolder - Folder in which to output the static HTML.
 */
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
			saveHtml(routes[route].template, html, helper.absolutePath(targetFolder), function() {
				processed += 1;
				logger.info(`Processed ${processed}/${max} - ${routes[route].template}`);
				if(processed === max) {
					logger.info(`Finished converting all templates in "${routesFile}".`);
				}
			});
		});
	});
}

/**
 *   Convert a routes template to static HTML.
 *   @param  {Object}   route         - Routes object.
 *   @param  {freemarker.js}   fm     - Instance of FreeMarker.js to use.
 *   @param  {String}   absRoutesFile - Abs path to routes file used
 *   @param  {Function} callback      - Called once finished with html.
 */
function convertRoute(route, fm, absRoutesFile, callback) {
	var ftlData = route.jsonFile ? require(path.resolve(path.dirname(absRoutesFile), route.jsonFile)) : route.data || {};
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

/**
 *   Save a static html file.
 *   @param  {String}   templatePath - Path to the template
 *   @param  {String}   html         - The html to save
 *   @param  {String}   targetFolder - Folder in which to save
 *   @param  {Function} callback     - Called once finished
 */
function saveHtml(templatePath, html, targetFolder, callback) {
	var htmlPath = templatePath.replace(/ftl$/, 'html');
	var destination = path.join(targetFolder, htmlPath);
	fs.writeFile(destination, html, callback);
}
