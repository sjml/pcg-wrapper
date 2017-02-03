// for testing to make sure the JavaScript output matches the expected
//   output from C. Right now relies on just manually changing values
//   here and recompiling and running. Should be remade to take values
//   from the command line, but ¯\_(ツ)_/¯

#include <stdio.h>

#include "../pcg-c/include/pcg_variants.h"

int main() {
    uint32_t seedLow   = 4u;
    uint32_t seedHigh  = 8u;
    uint32_t stateLow  = 15u;
    uint32_t stateHigh = 16u;

    uint64_t index = 4294967297ull;

    uint64_t state = (uint64_t) seedHigh << 32 | seedLow;
    uint64_t seq   = (uint64_t) stateHigh << 32 | stateLow;

    pcg32_random_t rng;
    pcg32_srandom_r(&rng, state, seq);

    pcg32_advance_r(&rng, index);

    uint32_t result = pcg32_random_r(&rng);

    printf("%" PRIu32 "\n", result);
}
