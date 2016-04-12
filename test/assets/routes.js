module.exports = {
    'GET /test': function() {
        throw new Error('Test error');
    },
    'GET /data/:id': function(req, res, next) {
        res.send({
            dataFound: true,
            sender: 'routes file',
            id: req.params.id
        });
    }
    ,
    'GET /data': function(req, res, next) {
        res.send({
            dataFound: true,
            sender: 'routes file'
        });
    }
}
