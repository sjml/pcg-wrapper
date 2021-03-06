#include <node.h>
#include <nan.h>

#include "./pcg-c/include/pcg_variants.h"


void RandomIntPull(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();

    if (args.Length() < 5) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "requires five arguments",
                v8::NewStringType::kInternalized).ToLocalChecked()
            )
        );
        return;
    }

    if (    !args[0]->IsUint32()
         || !args[1]->IsUint32()
         || !args[2]->IsUint32()
         || !args[3]->IsUint32()
       ) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "all seed values must be unsigned 32-bit integers (0 - 4294967295)",
                v8::NewStringType::kInternalized).ToLocalChecked()
            )
        );
        return;
    }

    uint64_t index = 0;
    uint64_t oldIndex = 0;
    char const * indexFormatException = "index must be a string representing a large integer or an unsigned 32-bit integer (0 - 4294967295)";
    if (!args[4]->IsUint32()) {
        if (!args[4]->IsString()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8(isolate, indexFormatException,
                    v8::NewStringType::kInternalized).ToLocalChecked()
                )
            );
            return;
        }
        else {
            // make an effort to convert that string
            v8::String::Utf8Value stringIndex(isolate, args[4]);
            if ((*stringIndex)[0] == '-') {
                isolate->ThrowException(v8::Exception::TypeError(
                    v8::String::NewFromUtf8(isolate, indexFormatException,
                        v8::NewStringType::kInternalized).ToLocalChecked()
                    )
                );
            }
            for (unsigned int i=0; (*stringIndex)[i] != '\0'; ++i) {
                if ( (*stringIndex)[i] >= '0' && (*stringIndex)[i] <= '9' ) {
                    oldIndex = index;
                    index = index * 10 + (*stringIndex)[i] - '0';
                    if (index < oldIndex) {
                        isolate->ThrowException(v8::Exception::TypeError(
                            v8::String::NewFromUtf8(isolate, indexFormatException,
                                v8::NewStringType::kInternalized).ToLocalChecked()
                            )
                        );
                    }
                }
                else {
                    isolate->ThrowException(v8::Exception::TypeError(
                        v8::String::NewFromUtf8(isolate, indexFormatException,
                            v8::NewStringType::kInternalized).ToLocalChecked()
                        )
                    );
                }
            }
        }
    }
    else {
        index = (uint64_t) args[4]->Uint32Value(Nan::GetCurrentContext()).FromJust();
    }

    uint32_t stateLow  = args[0]->Uint32Value(Nan::GetCurrentContext()).FromJust();
    uint32_t stateHigh = args[1]->Uint32Value(Nan::GetCurrentContext()).FromJust();
    uint32_t seqLow    = args[2]->Uint32Value(Nan::GetCurrentContext()).FromJust();
    uint32_t seqHigh   = args[3]->Uint32Value(Nan::GetCurrentContext()).FromJust();

    uint64_t state = (uint64_t) stateHigh << 32 | stateLow;
    uint64_t seq   = (uint64_t) seqHigh << 32 | seqLow;

    pcg32_random_t rng;
    pcg32_srandom_r(&rng, state, seq);

    pcg32_advance_r(&rng, index);

    uint32_t result = pcg32_random_r(&rng);

    args.GetReturnValue().Set(v8::Integer::NewFromUnsigned(isolate, result));
}

void init(v8::Local<v8::Object> exports) {
    NODE_SET_METHOD(exports, "_randomIntPull", RandomIntPull);
}

NODE_MODULE(pcg, init)
