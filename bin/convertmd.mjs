#!/usr/bin/env node

import { convertMDFile } from "../lib/convertmd.lib.mjs";

const pwd = process.cwd();
const fname = process.argv[2];
const fullPath = `${pwd}/${fname}`;

if (fname === undefined) {
  console.log("Please provide a file to convert.");
  process.exit(1);
}

const converted = await convertMDFile(fullPath);

console.log(converted);
