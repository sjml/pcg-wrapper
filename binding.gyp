{
  "targets": [
    {
      "target_name": "libpcg",
      "type": "static_library",
      "cflags": ["-std=c99"],
      "sources": [
        "src/pcg-c/src/pcg-advance-128.c",
        "src/pcg-c/src/pcg-advance-16.c",
        "src/pcg-c/src/pcg-advance-32.c",
        "src/pcg-c/src/pcg-advance-64.c",
        "src/pcg-c/src/pcg-advance-8.c",
        "src/pcg-c/src/pcg-global-32.c",
        "src/pcg-c/src/pcg-global-64.c",
        "src/pcg-c/src/pcg-output-128.c",
        "src/pcg-c/src/pcg-output-16.c",
        "src/pcg-c/src/pcg-output-32.c",
        "src/pcg-c/src/pcg-output-64.c",
        "src/pcg-c/src/pcg-output-8.c",
        "src/pcg-c/src/pcg-rngs-128.c",
        "src/pcg-c/src/pcg-rngs-16.c",
        "src/pcg-c/src/pcg-rngs-32.c",
        "src/pcg-c/src/pcg-rngs-64.c",
        "src/pcg-c/src/pcg-rngs-8.c"
      ],
      "include_dirs": [ "src/pcg-c/include" ]
    },
    {
      "target_name": "pcg",
      "sources": [ "src/pcg-js.cpp" ],
      "dependencies": [ "libpcg" ]
      }
    }
  ]
}
