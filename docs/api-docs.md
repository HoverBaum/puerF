# puerF (puer-freemarker) docs

This is the documentation of puerFs API as well as of all public functions and attributes of its sub-modules.

The documentation is generated using [jdsocs](https://github.com/jsdoc3/jsdoc) for which the complete manual may be found at [usejsdoc.org](http://usejsdoc.org/). To make the docs look better we use [docdash](https://github.com/clenemt/docdash).

# API

Including `puer-freemarker` gives you the following API:

### [puerf.init(options, callback)](module-puer-freemarker.html#.init)

Runs the initialization script.

### [puerf.start(options, callback)](module-puer-freemarker.html#.start)

Starts puerF, will looks for files to serve and mocked routes. The callback is called, once the puer server is up and running.

### [puerf.close(callback)](module-puer-freemarker.html#.close)

Closes the server down and calls the callback once that is done. (As of now this does not quite work, see this [issue](https://github.com/leeluolee/puer/issues/30) for more information)

## For developers

To generate the docs:
```
npm run jsdoc
```

To see them:
```
npm run serve-docs
```
Make sure you have all development dependencies installed.
