/**
    A file defining routes as reference.
*/
module.exports = {
    'GET /' : {
        template: 'home.ftl',
        jsonFile: '../data/home.json'
    },
    'GET /user/:id': {
        handler: function(req, res, next) {
            res.send({
                dataFound: true,
                id: req.params.id
            });
        }
    },
    'POST /user:id': {
        handler: function(req, res, next) {
            res.send({
                updated: true,
                id: req.params.id
            });
        }
    }
    'GET /simpleData': {
        data: {
            name: 'The users name',
            age: 99
        }
    },
    'GET /json': {
        jsonFile: '../data/data.json'
    }
}
