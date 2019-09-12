const fs = require('fs')
const path = require('path')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const xa = require('xa')
const xml2js = require('xml2js')
const moment = require('moment')

const parser = new xml2js.Parser()
const parseString = util.promisify(parser.parseString)

const cwd = process.cwd()

async function gpxlatest(options) {
    let _path = path.isAbsolute(options) ? options : `${cwd}/${options}`
    let gpxFile = await readFile(_path)
    let parsedFile = await parseString(gpxFile)
    let trkpts = parsedFile.gpx.trk[0].trkseg[0].trkpt

    let timestamps = []
    trkpts.forEach(trkpt => {
        timestamps.push(trkpt.time[0])
    });

    timestamps.sort((a,b) => {
        return moment(a).format("x") - moment(b).format("x")
    })

    xa.info(`the latest trkpt has the timestamp: ${timestamps[timestamps.length-1]}`);
    
}

module.exports = gpxlatest