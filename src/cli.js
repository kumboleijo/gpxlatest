// usage represents the help guide
const usage = function() {
    var usageText = `
    This tool helps you to find the latest timestamp of a gpx file.
  
    usage:  gpxlatest <file.gpx>

    <file.gpx>    relative path to the .gpx file
  `;
    console.log(usageText);
};

const gpxlatest = require('./main');

function cli(args) {
    let options = args.splice(2);
    if (options.length != 1) usage() && process.exit(1);
    else gpxlatest(options[0]);
}
module.exports = cli;
