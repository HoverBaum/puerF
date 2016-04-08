module.exports = {
    'GET /test': function() {
        throw new Error('Test error');
    }
}
