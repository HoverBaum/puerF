/**

    puer mock router module for puerFreemarker.

    Takes in the combined config file and creates express routes with it.

*/
module.exports = function createRouteLookup(config) {

    var routes = {
        get: new Map(),
        post: new Map(),
        delte: new Map()
    }

    //Iterate over all configured routes.
    for(key in config) {
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

        //Add this route and it's function to the router;
        routes[method].set(path, call);
    }

    return routes;

};
