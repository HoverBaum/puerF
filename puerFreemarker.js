var cli = require('commander');

//Configure commandline usage.
cli
    .usage('puerF [options]')
    .option('-f, --freemarker <file>', 'Mock file for Freemarker routes')
    .option('-m, --mock <file>', 'Your standard puer mock file')
    .option('-t, --templates <path>', 'Path to folder in which Freemarker templates are stored')
    .option('-p, --port', 'Specific port to use')
    .option('-w, --watch', 'Filetypes to watch, defaults to js|css|html|xhtml')
    .option('-x, --exclude', 'Exclude files from being watched for updates')
    .parse(process.argv);
