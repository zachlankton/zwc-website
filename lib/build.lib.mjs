const DEV = process.env.ZSSG_DEV_SERVER === "true";
console.log("DEV MODE", DEV);
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
const pfs = fs.promises;

import { ROOTDIR, SRCDIR, OUTDIR } from "../config/paths.mjs";
import { compileHBFile } from "./compilehbs.lib.mjs";

function errHandler(err) {
  console.error(err);
  process.exit(1);
  return;
}

async function build(src, out, data) {
  // TODO: how can we check if "included" files have been modified?
  // Cache will not work unless we can figure this out.
  // if ((await checkCache(src)) === "same") return;
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

async function checkCache(src) {
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

  // check if they are the same
  if (stat.mtime.toString() === cache) return "same";

  // must be different, update the cache
  await pfs.writeFile(`${ROOTDIR}/.cache/${src}`, stat.mtime.toString());

  return "different";
}

async function buildPages() {
  const hbsFiles = execSync(`find ${SRCDIR}/pages -print | grep -e '.hbs$'`);
  const hbsFilesArr = hbsFiles.toString().split("\n");
  hbsFilesArr.pop();
  console.log(hbsFilesArr);
  const promises = [];
  hbsFilesArr.forEach((f) => {
    const file = f.replace(`${SRCDIR}/pages/`, "");
    const ext = path.extname(file);
    const fname = path.basename(file, ext);
    let dir = path.dirname(file) + "/";
    if (dir === "./") dir = "";
    const p = build(`pages/${file}`, `${dir}${fname}.html`);
    promises.push(p);
  });

  // parallel build ftw!
  return await Promise.all(promises);
}

function includeAssets() {
  execSync("cp -r assets/* dist/");
}

export { includeAssets, buildPages };
export default build;
