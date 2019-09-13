const program = require('commander');
const pjson = require('../package.json');

const gpxlatest = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-i ,--input <file>', 'specify the input file');

    program.parse(argv);

    gpxlatest(program.input, program.output);
}

module.exports = cli;
