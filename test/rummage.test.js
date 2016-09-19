"use strict";
var rummage = require('../rummage');
var should = require('should');

describe('rummage', () => {
    it('should rummage', done =>{
        function transformer (source){
            return arguments[1]+'new Error('+arguments[2]+')'+arguments[3];
        }

        rummage({match: /(return callback\()(.*)(\))/, t: transformer, d: './test/src', f: ['html', 'css']}, {
            write: function(res){
                should.exist(res);
                res.should.eql('test\\src\\srcchild\\srcchildchild\\child2.js');
                done();
            }
        })
    });
});