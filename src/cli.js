const program = require('commander');
const pjson = require('../package.json');

const gpxlatest = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-i ,--input <file>', 'specify the input file')
        .option('-a, --all', 'show all timestamps (sorted)')
        .option('-f, --first', 'show the first (oldest) timestamp');

    program.parse(argv);

    gpxlatest(program.input, program.all, program.first);
}

module.exports = cli;
