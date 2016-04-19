/**
    Configuration file for puerF.

    Use it with the '-c' option.

    Each settings has a default value, uncomment and change them to use different.
    Relative paths here will be relative to the directory in which the cli is invoked.

*/
module.exports = {

    /**
        Files in which information about mocked routes is stored.
        Assumes by default that you split this into multiple files.
    */
    //routes: ['mock/routes.js', 'mock/ftlRoutes.js'];

    /**
        Folder in which FTL templates are stored.
    */
    //templates: 'templates';

    /**
        Root folder for file watching.
        Any file in this folder will trigger a reload.
    */
    //root: './';

    /**
        Port, to be used for the http server.
    */
    //port: 8080;

    /**
        The types of files to watch within the root (and recursively).
    */
    //watch: 'js|css|html|xhtml|ftl';

    /**
        Files excluded from being watched for updates.
        This must be a regular expression.
    */
    //exclude: '';

    /**
        Set this to true to use localhost instead of 127.0.0.1;
    */
    //localhost: false;

    /**
        If true browser will not be opened automatically.
    */
    //noBrowser: false;

    /**
        Enable debugging mode here.
    */
    //debug: false;

};
