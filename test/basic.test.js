const crypto = require('crypto');
const expect = require('chai').expect;

const pcg = require('../index');

let s1 = 0;
let s2 = 0;
let s3 = 0;
let s4 = 0;

// Testing of randomness is done externally via dieharder.
//   (see the notes in scripts/generateBigRandom.js)
// These tests are just check that the library is wired up
//   and the interface is behaving as it should.

describe('PCG interface', function () {
  beforeEach(function () {
    var seed = crypto.randomBytes(16);
    var dv = new DataView(seed.buffer, 0);
    s1 = dv.getUint32(0);
    s2 = dv.getUint32(4);
    s3 = dv.getUint32(8);
    s4 = dv.getUint32(12);
  });

  it('can produce a predictable random int', function () {
    var randomInteger = pcg.randomIntPull(4, 8, 15, 16, 2342);
    expect(randomInteger).to.equal(3275776275);
  });

  it('can take a string as an index', function () {
    var randomInteger = pcg.randomIntPull(4, 8, 15, 16, "2342");
    expect(randomInteger).to.equal(3275776275);
  });

  it('native function cannot take an index > 2^32 - 1', function () {
    expect(function() { pcg._randomIntPull(s1, s2, s3, s4, 4294967295); }).to.not.throw();
    expect(function() { pcg._randomIntPull(s1, s2, s3, s4, 4294967296); }).to.throw(TypeError);
  });

  it('can take a string representing the same large number', function () {
    expect(function() { pcg.randomIntPull(s1, s2, s3, s4, "4294967296"); }).to.not.throw();
  });

  it('rejects negative numbers in seeds', function () {
    expect(function() { pcg.randomIntPull(-s1,  s2,  s3,  s4, 429496725); }).to.throw(TypeError);
    expect(function() { pcg.randomIntPull( s1, -s2,  s3,  s4, 429496725); }).to.throw(TypeError);
    expect(function() { pcg.randomIntPull( s1,  s2, -s3,  s4, 429496725); }).to.throw(TypeError);
    expect(function() { pcg.randomIntPull( s1,  s2,  s3, -s4, 429496725); }).to.throw(TypeError);
  });

  it('rejects negative numbers in indices', function () {
    expect(function() { pcg.randomIntPull(s1, s2, s3, s4, -429496725); }).to.throw(TypeError);
  });

  it('rejects negative string indices', function () {
    expect(function() { pcg.randomIntPull(s1, s2, s3, s4, "-429496725"); }).to.throw(TypeError);
  });

  it('rejects indices greater than 2^64 - 1', function () {
    expect(function() { pcg.randomIntPull(s1, s2, s3, s4, "18446744073709551615"); }).to.not.throw();
    expect(function() { pcg.randomIntPull(s1, s2, s3, s4, "18446744073709551616"); }).to.throw(TypeError);
  })
});
