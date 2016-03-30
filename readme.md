Commandline interface to use puer with Freemarker templates.

UNDER DEVELOPMENT - PRE RELEASE!
Unstable and may not support all features yet.

## Usage

Install with:
```
npm install -g puer-freemarker-cli
```

Move into your working directory and run it:
```
cd your/working/directory
puerF
```

### Command reference

Coming soon TM.

## Mocking requests

This is what puerF is really all about. Making it as easy as possible for you to "fake" a backend. To achieve this puerF builds upon [puers mocking of request](https://github.com/leeluolee/puer#mock-request). And simplefies the use of Freemarker templates for those requests.

puerF will automatically look for two route files. `mock/routes.js` and `mock/ftlRoutes.js`. While `routes.js` should follow the [puer documentation](https://github.com/leeluolee/puer#mock-request) and can mock any kind of route, the `ftlRoutes.js` file can only contain Freemarker routes.

Should you wish to use files from a different location you can do so useing the `-a` and `-l` options.

### Freemarker routes

The file containing routes for Freemarker should export a single object containing key like a standard puer routes mock file but provide objects as values for those keys. These 'route configurations' should have two properties:
- template:     The template to use.
- data:         Data that should be handed to the template.

Note that if `data` has an attribute called `user` the template will get a variable called `user` passed to it.



# Approaches
## Gulp task
Create a task that:
- Read a config file (routes.js) that has routes and files that should be rendered for those routes with data for the files
- parse that file into a data.js file
- use the data.js with puer

Puer mocks http request and listens for file changes

What I build will enable users to run `gulp testserver`

What happens in reality is more like `parse file into data.js and watch for changes` `puer -a data.js`

Write a gulp plugin to abstract this away

### gulp-puer-freemarker

```javascript
var pf = require('gulp-puer-freemarker');

gulp.task('mock', function() {
    gulp.src('path/to/routes.js')
    .pipe(pf())
});
```

## Commandline interface
Get it with `npm install puer-freemarker-cli`

Use as `puer-freemarker path/to/file.js` Starts a puer server, listens to changes on the file and updates on changes.

# Config file

There should be a config file handling all request to '.ftl' files. If you also want to mock other requests to the backend please specify another config file for that, following the specifications for [puer mock-files](https://github.com/leeluolee/puer#mock-request).

``` javascript
module.exports = {     
    'GET /v1/posts': {
        template: 'template/path.ftl',
        data: {
            name: 'value',
            objName: {
                property: 'someValue',
                number: 13
            }
        }
    },
    //....
}
```

# Setup

You need to run a few commands to get set up.
```
npm install gulp -g
npm install
```

No you can run the task to mock a server.
`gulp mock`
