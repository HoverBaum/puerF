/**
    File for testing, describing routes for all tpossible types.
*/
module.exports = {
    'GET /': function() {

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
    'GET /user/:id': function() {
        return true;
    }
}
