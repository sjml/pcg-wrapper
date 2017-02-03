const expect = require('chai').expect;

const pcg = require('../index');

describe('Basic setup and linking', function () {
  it('can produce a predictable random int', function () {
    var randomInteger = pcg.randomIntPull(4, 8, 15, 16, 2342);
    expect(randomInteger).to.equal(3275776275);
  });

  // testing of randomness is done externally via dieharder
  //   (see the notes in scripts/generateBigRandom.js)

  it('can take a string as an index', function () {
    var randomInteger = pcg.randomIntPull(4, 8, 15, 16, "2342");
    expect(randomInteger).to.equal(3275776275);
  });

  it('native function cannot take a number > 2^32 - 1', function () {
    expect(function() { pcg._randomIntPull(4, 8, 15, 16, 4294967297); }).to.throw(TypeError);
  });

  it('can take a string representing the same large number', function () {
    expect(function() { pcg.randomIntPull(4, 8, 15, 16, "4294967297"); }).to.not.throw();
  });

  it('rejects negative numbers in seeds', function () {
    expect(function() { pcg.randomIntPull(-4, 8, 15, 16, 429496725); }).to.throw(TypeError);
  });

  it('rejects negative numbers in indices', function () {
    expect(function() { pcg.randomIntPull(4, 8, 15, 16, -429496725); }).to.throw(TypeError);
  });

  it('rejects negative string indices', function () {
    expect(function() { pcg.randomIntPull(4, 8, 15, 16, "-429496725"); }).to.throw(TypeError);
  });
});
