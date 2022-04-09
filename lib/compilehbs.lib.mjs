import fs from "fs";
const pfs = fs.promises;
import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers";
import { convertMD, convertMDFile } from "./convertmd.lib.mjs";
import loadCustomHelpers from "../config/custom.helpers.mjs";
import { ROOTDIR, SRCDIR, OUTDIR } from "../config/paths.mjs";

const hb = asyncHelpers(Handlebars);
loadCustomHelpers(regHelper);

regHelper("mdfile", async (path) => {
  const results = await convertMDFile(`${SRCDIR}/${path}`);
  return new Handlebars.SafeString(results);
});

regHelper("convertMD", async (txt) => {
  const results = await convertMD(txt);
  return new Handlebars.SafeString(results);
});

regHelper("include", async (path, data) => {
  const results = await compileHBFile(`${SRCDIR}/${path}`, data);
  return new Handlebars.SafeString(results);
});

regHelper("useLayout", async function (layout, options) {
  const thisHTML = options.fn(this);
  options.data.root.CONTENT = options.fn(this);
  const results = await compileHBFile(`${SRCDIR}/${layout}`, options.data.root);
  return new Handlebars.SafeString(results).toString();
});

regHelper("use-layout", function (layout) {
  this.USE_LAYOUT = layout;
  return "";
});

regHelper("meta-description", function (desc) {
  this.META_DESCRIPTION = desc;
  return "";
});

regHelper("page-title", function (title) {
  this.PAGE_TITLE = title;
  return "";
});

regHelper("dev-server", async function () {
  if (this.DEV) {
    const results = await compileHBFile(`${SRCDIR}/dev-server.js`);
    return new Handlebars.SafeString(`<script> \n ${results} \n </script>`);
  }
  return "";
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
