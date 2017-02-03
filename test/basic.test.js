const expect = require('chai').expect;

const pcg = require('../index');

describe('Basic setup and linking', function () {
  it('can produce a predictable random int', function () {
    var randomInteger = pcg.randomIntPull(4, 8, 15, 16, 2342);
    expect(randomInteger).to.equal(3275776275);
  });

  // testing of randomness is done externally via dieharder
  //   (see the notes in scripts/generateBigRandom.js)
});
