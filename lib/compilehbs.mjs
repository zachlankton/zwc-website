import fs from "fs";
const pfs = fs.promises;
import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers";
import { convertMD, convertMDFile } from "./convertmd.mjs";

const hb = asyncHelpers(Handlebars);

regHelper("mdfile", async (path) => {
  const results = await convertMDFile(`${process.cwd()}/src/${path}`);
  return new Handlebars.SafeString(results);
});

regHelper("convertMD", (txt) => {
  const results = convertMD(txt);
  return Handlebars.SafeString(results);
});

regHelper("include", async (path, data) => {
  const results = await compileHBFile(`${process.cwd()}/src/${path}`, data);
  return new Handlebars.SafeString(results);
});

regHelper("compileHB", async (txt, data) => {
  const results = await compileHB(txt, data);
  return new Handlebars.SafeString(results);
});

regHelper("pwd", () => {
  return process.cwd();
});

export function regHelper(name, fn) {
  hb.registerHelper(name, fn);
}

function errHandler(err) {
  console.error(err);
  process.exit(1);
  return;
}

export async function compileHBFile(fullPath, data) {
  const txt = await pfs.readFile(fullPath, "utf8").catch(errHandler);
  return compileHB(txt, data);
}

export async function compileHB(txt, data) {
  const template = hb.compile(txt);
  const results = await template(data);
  return results;
}
