# PCG for Node.js

[![Mac/Linux Status](https://travis-ci.org/sjml/pcg-wrapper.svg?branch=master)](https://travis-ci.org/sjml/pcg-wrapper)
[![Windows build status](https://ci.appveyor.com/api/projects/status/36yvs70egyhwvevt?svg=true)](https://ci.appveyor.com/project/sjml/pcg-wrapper)

This is a wrapper module for the [PCG random number generator](http://www.pcg-random.org).

PCG is not cryptographically secure, and it's got a couple other weaknesses,
but it also has a few qualities that make it useful for games. Namely, it's fast,
repeatable, and can easily jump to anywhere in its sequence given the seed and 
an index. Thus we can replay the random generation from any point in the sequence,
which is helpful for game playback and logging of randomness. 

## Usage
### Pull a specific integer from a sequence. 
PCG needs four unsigned 32-bit integers as its seeds. (See Clarifications 
section below.)  You can pass these four integers in along with an index to 
get that number in the sequence. 

```js
var pcg = require('pcg-wrapper');

var randomInteger = pcg.randomIntPull(4, 8, 15, 16, 2342);
console.log(randomInteger); // will always output 3275776275
```

Note that the same seeds and index will *always* produce the same number. Make 
sure you advance the index every time you want a new random number. 

### Seed values
You can get some initial seed values in all kinds of ways. To pull them from
Node's approved randomness sources: 

```js
const crypto = require('crypto');

var seed = crypto.randomBytes(16); // == 128 bits == four 32-bit integers

var dv = new DataView(seed.buffer, 0);

var s1 = dv.getUint32(0);
var s2 = dv.getUint32(4);
var s3 = dv.getUint32(8);
var s4 = dv.getUint32(12);

var index = 0;

pcg.randomIntPull(s1, s2, s3, s4, index);
index += 1; // (or you could do index++ in previous line)
```

## Clarifications and caveats
* Description of the seeds is slightly inaccurate, but close enough for what we 
  care about. If you're  curious as to what these values actually map to, check 
  out the [PCG C library documentation](http://www.pcg-random.org/using-pcg-c.html).
  The "seeds" here correspond to the low and high bits of the seed and sequence.

* There is a mild decline in performance as the index climbs higher; in my testing 
  on a 2.6 GHz Intel Core i5, it amounted to a few hundred nanoseconds at the worst. 
  Safely negligible in most contexts, but something to be aware of. 
  * The biggest dip in performance comes as the index crosses the 32-bit
    limit; doing the work to convert strings to integers isn't free.

* The index is presently limited to the range of 64-bit unsigned integers, and 
  you'll get an exception if you exceed that range.

* JavaScript numbers are limited to 53-bits, so if you want to pass a larger value,
  you need to convert it to a string first. The native layer will convert it into
  a 64-bit integer for the calculation.
