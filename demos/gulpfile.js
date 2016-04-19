/*
    An Illustration of how puerF might be used with gulp.
*/

var gulp = require('gulp');
var puerf = require('puer-freemarker');

gulp.task('puerf', function() {

    //Define options:
    var options = {
        //routes: ['mock/routes.js', 'mock/ftlRoutes.js']
        //templates: 'templates'
        //root: './'
        //port: 8080
        //watch: 'js|css|html|xhtml|ftl'
        //exclude: ''
        //localhost: false
        //browser: false
        //debug: false
    };

    //Start puerF with options.
    puerf.start(options);
});
