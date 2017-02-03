#include <node.h>

#include "./pcg-c/include/pcg_variants.h"


void RandomIntPull(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();

    if (args.Length() < 5) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "requires five arguments")));
        return;
    }

    if (    !args[0]->IsUint32()
         || !args[1]->IsUint32()
         || !args[2]->IsUint32()
         || !args[3]->IsUint32()
         || !args[4]->IsUint32()
       ) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "all arguments must be unsigned 32-bit integers (0 - 4294967295)")));
        return;
    }

    uint32_t seed1Low  = args[0]->Uint32Value();
    uint32_t seed1High = args[1]->Uint32Value();
    uint32_t seed2Low  = args[2]->Uint32Value();
    uint32_t seed2High = args[3]->Uint32Value();
    uint32_t index     = args[4]->Uint32Value();

    uint64_t state = (uint64_t) seed1High << 32 | seed1Low;
    uint64_t seq   = (uint64_t) seed2High << 32 | seed2Low;

    pcg32_random_t rng;
    pcg32_srandom_r(&rng, state, seq);

    pcg32_advance_r(&rng, index);

    uint32_t result = pcg32_random_r(&rng);

    args.GetReturnValue().Set(v8::Integer::NewFromUnsigned(isolate, result));
}

void init(v8::Local<v8::Object> exports) {
    NODE_SET_METHOD(exports, "randomIntPull", RandomIntPull);
}

NODE_MODULE(pcg, init)
