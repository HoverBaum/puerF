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
    'GET /test': function() {
        throw(new Error('Test error'));
    }
}
