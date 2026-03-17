import { defineConfig } from "tsup";

export default defineConfig([
  // Library build — ESM + CJS + DTS
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
  },
  // CLI build — ESM only, with shebang
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    banner: { js: "#!/usr/bin/env node" },
    dts: false,
    clean: false,
  },
]);
