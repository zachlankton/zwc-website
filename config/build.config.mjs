#!/usr/bin/env node

import build, { buildPages, includeAssets } from "../lib/build.lib.mjs";

// You can manually build files with custom in and out (w/ optional data) if you need more control
// await build("index.hbs", "index.html", { hello: "Hello World from Data" });
// await build("test1/test2/test3.hbs", "test1/test2/test3.html");

// Look for all files that end with *.hbs and build them!
await buildPages();

includeAssets();
