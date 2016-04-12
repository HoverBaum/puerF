module.exports = {
"GET /error": function () {
        throw new Error('Test error');
    },
"GET /ftl": function(req, res, next) {
            var data = JSON.parse('{"testOK":true,"name":"Tester2"}');
            fm.render('test', data, function(err, data, out) {
                res.writeHeader(200, {
                    "Content-Type": "text/html"
                });
                res.write(data);
                res.end();
            });
        }
}
