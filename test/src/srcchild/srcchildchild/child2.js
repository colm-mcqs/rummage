"use strict";
var child2 = function(err, res){
    if(err) return callback(new Error('this is the err'));
    callback(null, res);
};

module.exports = child2;