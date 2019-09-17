# gpxlatest

This tool helps you to find the latest timestamp of a gpx file.

## Install 

```sh
npm i -g gpxlatest
```

## Usage

```sh
Usage: gpxlatest [options]

This tool helps you to find the latest timestamp of a gpx file.

Options:
  -V, --version        output the version number
  -i ,--input <file>   specify the input file
  -a, --all            show all timestamps (sorted) (default: false)
  -f, --first          show the first (oldest) timestamp (default: false)
  --start <TIMESTAMP>  filterStart (default: null)
  --stop <TIMESTAMP>   filterStop (default: null)
  -s, --save           save output to a file (default: false)
  -o, --output <file>  specify the output file
  -h, --help           output usage information
```