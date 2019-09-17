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
        .option('--start <TIMESTAMP>', 'filterStart', null)
        .option('--stop <TIMESTAMP>', 'filterStop', null)
        .option('-s, --save', 'save output to a file', false)
        .option('-o, --output <file>', 'specify the output file');

    program.parse(argv);

    gpxlatest(program.input, program.all, program.first, program.start, program.stop, program.save, program.output);
}

module.exports = cli;
