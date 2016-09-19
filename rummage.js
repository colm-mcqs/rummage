"use strict";
var pino = require('pino');
var pretty = pino.pretty();
pretty.pipe(process.stdout);
var log = pino({
    name: 'app',
    safe: true
}, pretty);

var fs = require('fs');
var optimist = require('optimist');
var recursiveReaddir = require('recursive-readdir');
function rummage (opts, stream){
    log.info('rummaging....');
    stream = stream || process.stdout;
    return new Rummage(stream, opts.match, opts.d, opts.f);
}

function Rummage (stream, match, dir, filetypes){
    this.stream = stream;
    this.dir = dir;
    this.match = match;
    this.filetypes = filetypes.map(x => `*.${x}`);

    this.checkInside = function(match, contents, file){
        if (match.test(contents)) {
            this.stream.write(file);
        }
    };
    var that = this;
    recursiveReaddir(this.dir, this.filetypes, (err, files) => {
        files.forEach(function(file) {
            fs.readFile(file, 'utf-8', function(err, contents) {
                that.checkInside(that.match, contents, file);
            });
        })
    });

    process.on('exit', (evt) => {
        console.log(evt);
    });
}

/*
Rummage.prototype.write = function(s){
    return this.stream.write(s);
};*/

if (require.main === module) {
    if (arg('-h') || arg('--help')) {
        usage().pipe(process.stdout)
    } else if (arg('-v') || arg('--version')) {
        console.log(require('./package.json').version)
    } else {
        process.stdin.pipe(
            rummage(optimist.argv
        )).pipe(process.stdout)
    }
}

function usage () {
    return require('fs')
        .createReadStream(require('path').join(__dirname, 'usage.txt'))
}

function arg (s) {
    return !!~process.argv.indexOf(s)
}

module.exports = rummage;