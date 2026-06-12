import { defineConfig } from "tsup";
import { copyFileSync } from "node:fs";

// Pre-built ESM library (E1 Phase B1, CR-NS-048). Emits ESM + d.ts and ships
// `tokens.css` as-is (NOT bundled) — the Tailwind v4 @theme/@layer source that
// consumers @import + @source-scan. `dist/` is committed so git-dep consumers
// get prebuilt files without a build-on-install.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  onSuccess: async () => {
    copyFileSync("src/tokens.css", "dist/tokens.css");
  },
});
