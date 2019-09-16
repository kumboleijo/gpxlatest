const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const xa = require('xa');
const xml2js = require('xml2js');
const moment = require('moment');

const parser = new xml2js.Parser();
const parseString = util.promisify(parser.parseString);

const cwd = process.cwd();

async function gpxlatest(program) {
    let input = program.input;

    xa.info('input:  ' + input);
    let _inputPath = path.isAbsolute(input) ? input : `${cwd}/${input}`;
    let gpxFile = await readFile(_inputPath);
    let parsedFile = await parseString(gpxFile);
    let trkpts;
    try {
        trkpts = parsedFile.gpx.trk[0].trkseg[0].trkpt;
        if (trkpts.length == 0) process.exit(1);
    } catch (error) {
        xa.error('no trkpts found in the given file');
        process.exit(1);
    }

    xa.success('parse input file');

    let timestamps = [];
    try {
        trkpts.forEach(trkpt => {
            timestamps.push(trkpt.time[0]);
        });

        timestamps.sort((a, b) => {
            return moment(a).format('x') - moment(b).format('x');
        });
    } catch (error) {
        xa.error('no timestamps in the trkpts');
        process.exit(1);
    }

    if (program.all) {
        xa.info('All Timestamps:');
        timestamps.forEach(timestamp => {
            console.log(timestamp);
        });
    }

    if (program.first) {
        xa.info(`First Timestamp:  ${timestamps[0]}`);
        xa.info(`Latest Timestamp: ${timestamps[timestamps.length - 1]}`);
    } else xa.info(`Latest Timestamp: ${timestamps[timestamps.length - 1]}`);
}

module.exports = gpxlatest;
