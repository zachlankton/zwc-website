const DEV = process.env.ZSSG_DEV_SERVER === "true";
console.log("DEV MODE", DEV);
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
const pfs = fs.promises;

import { ROOTDIR, SRCDIR, OUTDIR } from "../config/paths.mjs";
import { compileHBFile, regHelper } from "./compilehbs.lib.mjs";

const cacheWrites = new Map();

function errHandler(err) {
  console.error(err);
  process.exit(1);
  return;
}

async function build(src, out, data, helperPath) {
  if ((await checkCache(src, helperPath)) === "same") return;
  console.log("Building", src);
  data = data || {};
  data.DEV = DEV;
  const results = await compileHBFile(`${SRCDIR}/${src}`, data);

  // make output directory if not exists
  if (!fs.existsSync(path.dirname(`${OUTDIR}/${out}`))) {
    fs.mkdirSync(path.dirname(`${OUTDIR}/${out}`), { recursive: true });
  }

  await pfs.writeFile(`${OUTDIR}/${out}`, results).catch(errHandler);
}

async function checkCache(src, helperPath) {
  if (!DEV) return false;

  // make cache directory if not exists
  if (!fs.existsSync(path.dirname(`${ROOTDIR}/.cache/${src}`))) {
    fs.mkdirSync(path.dirname(`${ROOTDIR}/.cache/${src}`), { recursive: true });
  }

  // get stat of src file
  const stat = await pfs.stat(`${SRCDIR}/${src}`).catch(errHandler);

  // attempt to read the cache file if any
  const cache = await pfs
    .readFile(`${ROOTDIR}/.cache/${src}`, "utf8")
    .catch((err) => {
      if (err.code === "ENOENT") {
        return "ENOENT";
      } else errHandler(err);
    });

  let flag = "same";

  // check if they are different
  if (stat.mtime.toString() !== cache) {
    // must be different, update the cache
    cacheWrites.set(`${ROOTDIR}/.cache/${src}`, stat.mtime.toString());
    flag = "different";
  }

  // scan the file for included paths
  const includesRegexp = /{{(mdfile|#useLayout|include) "(.*)"\s*}}/g;
  const txt = await pfs.readFile(`${SRCDIR}/${src}`, "utf8").catch(errHandler);
  const includes = [...txt.matchAll(includesRegexp)];
  const paths = includes.map((x) => x[2]);
  if (helperPath) paths.push(helperPath);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    // recursively check included files cache
    if ((await checkCache(path)) === "different") flag = "different";
  }

  return flag;
}

async function writeCache() {
  console.log("Writing Cache ...");
  const it = cacheWrites.entries();
  let result = it.next();
  while (!result.done) {
    const path = result.value[0];
    const mtime = result.value[1];
    pfs.writeFile(path, mtime);
    result = it.next();
  }
  console.log("Done Writing Cache.");
}

async function buildPages() {
  const hbsFiles = execSync(`find ${SRCDIR}/pages -print | grep -e '.hbs$'`);
  const hbsFilesArr = hbsFiles.toString().split("\n");
  hbsFilesArr.pop();
  const promises = [];

  for (let i = 0; i < hbsFilesArr.length; i++) {
    const f = hbsFilesArr[i];
    const file = f.replace(`${SRCDIR}/pages/`, "");
    const ext = path.extname(file);
    const fname = path.basename(file, ext);
    let dir = path.dirname(file) + "/";
    if (dir === "./") dir = "";

    let helperPath = `/pages/${dir}helpers.mjs`;
    const helpers = await import(SRCDIR + helperPath).catch((e) => e.code);
    if (helpers !== "ERR_MODULE_NOT_FOUND" && helpers.default) {
      console.log("Registering Custom Helpers... ", SRCDIR + helperPath);
      helpers.default(regHelper);
    } else {
      helperPath = "";
    }

    const p = await build(
      `pages/${file}`,
      `${dir}${fname}.html`,
      null,
      helperPath
    );
  }

  if (DEV) await writeCache();
}

function includeAssets() {
  console.log("Including All Other Assets ...");
  const res1 = execSync(
    "rsync -avh --exclude 'helpers.mjs' --exclude '*.hbs' --exclude '*.md' src/pages/ dist/"
  );
  const res2 = execSync(
    "rsync -avh --exclude 'helpers.mjs' --exclude '*.hbs' --exclude '*.md' src/assets/ dist/"
  );
  console.log(res1.toString());
  console.log(res2.toString());
}

export { includeAssets, buildPages };
export default build;
