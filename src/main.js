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

async function filter(trkpts, filterStart = null, filterStop = null) {
    // 2019-01-01T04:44:08+03:00 -> 2019-12-12T04:44:08+03:00
    // 2017-01-01T04:44:08+03:00 -> 2019-12-12T04:44:08+03:00
    let filterStartUnix = filterStart != null ? moment(filterStart).format('x') : 'no filterStart';
    let filterStopUnix = filterStop != null ? moment(filterStop).format('x') : 'no filterStop';

    let trkptsFiltered;

    if (filterStart) {
        trkptsFiltered = trkpts.filter(trkpt => moment(trkpt.time[0]).format('x') > filterStartUnix);
    }
    if (filterStop) {
        trkptsFiltered = trkpts.filter(trkpt => moment(trkpt.time[0]).format('x') < filterStopUnix);
    }

    xa.success('filtered trackpoints by timestamps');

    return trkptsFiltered;
}

async function gpxlatest(input, all, first, filterStart, filterStop) {
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

    try {
        trkpts.sort((a, b) => {
            return moment(a.time[0]).format('x') - moment(b.time[0]).format('x');
        });
    } catch (error) {
        xa.error('no timestamps in the trkpts');
        process.exit(1);
    }

    let trkptsFiltered;

    if (filterStart != null || filterStop != null) {
        trkptsFiltered = await filter(trkpts, filterStart, filterStop);
    }

    if (all) {
        xa.info('All Timestamps:');

        if (trkptsFiltered != null) {
            trkptsFiltered.forEach(trkpt => {
                console.log(trkpt.time[0]);
            });
        } else {
            trkpts.forEach(trkpt => {
                console.log(trkpt.time[0]);
            });
        }
    }

    if (trkptsFiltered != null) {
        if (first) {
            xa.info(`First Timestamp:  ${trkptsFiltered[0].time[0]}`);
            xa.info(`Latest Timestamp: ${trkptsFiltered[trkptsFiltered.length - 1].time[0]}`);
        } else xa.info(`Latest Timestamp: ${trkptsFiltered[trkptsFiltered.length - 1].time[0]}`);
    } else {
        if (first) {
            xa.info(`First Timestamp:  ${trkpts[0].time[0]}`);
            xa.info(`Latest Timestamp: ${trkpts[trkpts.length - 1].time[0]}`);
        } else xa.info(`Latest Timestamp: ${trkpts[trkpts.length - 1].time[0]}`);
    }

    let result = {
        trackpoints: trkptsFiltered != null ? trkptsFiltered : trkpts,
        first: trkptsFiltered != null ? trkptsFiltered[0].time[0] : trkpts[0].time[0],
        latest: trkptsFiltered != null ? trkptsFiltered[trkptsFiltered.length - 1].time[0] : trkpts[trkpts.length - 1].time[0]
    };

    return result;
}

module.exports = gpxlatest;
