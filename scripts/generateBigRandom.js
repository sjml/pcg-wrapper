// Generates a file of 10 million random numbers for testing by dieharder
//   Install dieharder via homebrew or whatever you like, then run:
//           dieharder -a -g 202 -f bigRandom.txt
//
//   Note that this will fail or be shamed as "WEAK" on a few of the tests.
//     That's ok; this isn't meant to be a secure number generator. If
//     It fails more than a few tests, though, that probably means something
//     is wrong with the library or the wrapping.
//

const crypto = require('crypto');
const fs     = require('fs');

const pcg = require('../index');

const seed = crypto.randomBytes(16);

const dv = new DataView(seed.buffer, 0);

const s1 = dv.getUint32(0);
const s2 = dv.getUint32(4);
const s3 = dv.getUint32(8);
const s4 = dv.getUint32(12);

const numSamples = 10000000;

let outStream = fs.createWriteStream('bigRandom.txt');
outStream.write('#==================================================================\n');
outStream.write('# generator pcg  seed = ' + seed.toString('hex') + '\n');
outStream.write('#==================================================================\n');
outStream.write('type: d\n');
outStream.write('count: ' + numSamples.toString() + '\n');
outStream.write('numbit: 32\n');

let index = 0;
function writeRandom() {
  let ok = true;
  do {
    let outValue = pcg.randomIntPull(s1, s2, s3, s4, index).toString();
    index += 1;
    if (index >= numSamples) {
      outStream.write(outValue);
      outStream.write('\n');
      outStream.end();
    }
    else {
      ok = outStream.write(outValue);
      outStream.write('\n');
    }
  } while (index < numSamples && ok);

  if (index < numSamples) {
    outStream.once('drain', writeRandom);
  }
}
writeRandom();

