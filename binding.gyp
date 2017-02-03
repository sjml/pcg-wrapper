{
  "targets": [
    {
      "target_name": "libpcg",
      "type": "none",
      "actions": [
          {
              "action_name": "build_libpcg",
              "inputs": [],
              "outputs": [ "<(module_root_dir)/src/pcg-c/src/libpcg_random.a" ],
              "action": [ "make", "-C", "<(module_root_dir)/src/pcg-c/src"],
              "message": "Building the PCG library from source."
          }
      ]
    },
    {
      "target_name": "pcg",
      "sources": [ "src/pcg-js.cpp" ],
      "dependencies": [ "libpcg" ],
      "link_settings": {
          "libraries": ["-lpcg_random", "-L<(module_root_dir)/src/pcg-c/src"]
      }
    }
  ]
}
