#!/usr/bin/env node

import { compileHBFile } from "./lib/compilehbs.mjs";

const test = await compileHBFile("src/index.hbs", { hello: "Hello World!" });

console.log(test);
