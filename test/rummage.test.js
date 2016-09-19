"use strict";
var rummage = require('../rummage');
var should = require('should');
var path = require('path');
var rimraf = require('rimraf');
describe('rummage', () => {
    it('should rummage', done =>{
        function transformer (source){
            return arguments[1]+'new Error('+arguments[2]+')'+arguments[3];
        }

        rummage({match: /(return callback\()(.*)(\))/, t: transformer, d: './test/src', f: ['html', 'css']}, {
            write: function(res){
                should.exist(res);
                path.basename(res).should.eql('child2.js');
                rimraf(res+'.new', done);
            }
        })
    });
});