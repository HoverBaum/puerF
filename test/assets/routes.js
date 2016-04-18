module.exports = {
    'GET /test': {
        handler: function() {
            throw new Error('Test error');
        }
    },
    'GET /data/:id': {
        handler: function(req, res, next) {
            res.send({
                dataFound: true,
                sender: 'routes file',
                id: req.params.id
            });
        }
    },
    'GET /data': {
        data: {
            dataFound: true,
            sender: 'routes file'
        }
    }
}
