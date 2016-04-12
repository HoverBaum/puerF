/**

    puer mock router module for puerFreemarker.

    Returns an object in which one can look up what to do on which route.

*/
var logger = require('./logger');
module.exports = function createRouteLookup(config) {
    logger.silly('Creating a route lookup object', config);

    //The store of what to do for which route.
    var routes = {
        get: new Map(),
        post: new Map(),
        delete: new Map(),
        put: new Map()
    }

    //Iterate over all configured routes.
    for (key in config) {
        parseRoute(key, config[key]);
    }

    /**
     *   Take an identifier and a function to be called for a route.
     *   @param identifier   Describes the route, such as "GET /index".
     *   @param call         The function to call when route is accessed.
     */
    function parseRoute(identifier, call) {
        identifiers = identifier.split(' ');
        var method = identifiers[0].toLowerCase();
        var path = identifiers[1];
        var info = createPathObject(path);
        info.call = call;
        logger.silly('Parsed a route for mocking', {
            method,
            path,
            call
        })

        //Add this route and it's function to the router;
        routes[method].set(path, info);
    }

    /**
     *   Create an object that rpresents a URL and possible parameters in the it.
     */
    function createPathObject(path) {
        var obj = {
            path: '',
            params: []
        }
        if (/:/g.test(path)) {
            var parts = path.split(':');
            obj.path = parts.shift().replace(/\/$/, '');
            parts.forEach(param => {
                obj.params.push(param.replace(/\/$/, ''));
            });
        } else {
            obj.path = path;
        }
        return obj;
    }

    return routes;

};
