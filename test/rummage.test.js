"use strict";
var rummage = require('../rummage');
var should = require('should');

describe('rummage', () => {
    it('should rummage', done =>{
        rummage({match: /return callback\((.*)\)/, d: './test/src', f: ['html', 'css']}, {
            write: function(res){
                should.exist(res);
                res.should.eql('test\\src\\srcchild\\srcchildchild\\child2.js');
                done();
            }
        })
    });
});