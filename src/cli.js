const program = require('commander');
const pjson = require('../package.json');

const gpxlatest = require('./main');

function cli(argv) {
    program
        .version(pjson.version)
        .description(pjson.description)
        .option('-i ,--input <file>', 'specify the input file')
        .option('-a, --all', 'show all timestamps (sorted)', false)
        .option('-f, --first', 'show the first (oldest) timestamp', false)
        .option('-s, --start <TIMESTAMP>', 'filterStart', null)
        .option('-t, --stop <TIMESTAMP>', 'filterStop', null);

    program.parse(argv);

    gpxlatest(program.input, program.all, program.first, program.start, program.stop);
}

module.exports = cli;
