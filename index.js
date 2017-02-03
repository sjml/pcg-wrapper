var pcg = require('./build/Release/pcg');

// 4294967297
pcg.randomIntPull = function(s1, s2, s3, s4, index) {
  if (index > 4294967295) {
    index = index.toString();
  }
  return pcg._randomIntPull(s1, s2, s3, s4, index);
}

module.exports = pcg;
