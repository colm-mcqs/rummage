"use strict";
var pino = require('pino');
var pretty = pino.pretty();
var path = require('path');
pretty.pipe(process.stdout);
var log = pino({
    name: 'app',
    safe: true
}, pretty);

var replace = require('replacestream');
var fs = require('fs');
var optimist = require('optimist');
var recursiveReaddir = require('recursive-readdir');
function rummage (opts, stream){
    log.info(opts, 'rummaging....');
    stream = stream || process.stdout;
    return new Rummage(stream, opts.match, opts.t, opts.d, opts.f);
}

function Rummage (stream, match, transformer, dir, filetypes){
    this.stream = stream;
    this.dir = path.normalize(dir);
    this.match = match;
    this.filetypes = filetypes.map(x => `*.${x}`);

    var that = this;
    this.checkInside = function(match, contents, file){
        if (match.test(contents)) {
            if(typeof transformer == 'function'){
                fs.createReadStream(path.join(__dirname, file))
                    .pipe(replace(match, transformer))
                    .pipe(fs.createWriteStream(file+'.new'));
            }
            that.stream.write(file);
        }
    };
    recursiveReaddir(this.dir, this.filetypes, (err, files) => {
        files.forEach(function(file) {
            fs.readFile(file, 'utf-8', function(err, contents) {
                that.checkInside(that.match, contents, file);
            });
        })
    });
}

module.exports = rummage;