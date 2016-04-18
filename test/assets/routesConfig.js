/**
    File for testing, describing routes for all tpossible types.
*/
module.exports = {
    'GET /': function() {
        throw(new Error('Got home'));
    },
    'PUT /': function() {

    },
    'DELETE /': function() {

    },
    'POST /': function() {

    },
    'POST /postTest': function() {
        throw(new Error('POST error'));
    },
    'GET /test': function() {
        throw(new Error('Test error'));
    },
    'GET /user/:id/:name': function() {
        return true;
    },
    'GET /user/:id': function() {
        return false;
    }
}
