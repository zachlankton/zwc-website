import "dotenv/config";

const ROOTDIR = process.env.ZSSG_ROOT || process.cwd() + "/";
const SRCDIR = process.env.ZSSG_SRC || process.cwd() + "/src";
const OUTDIR = process.env.ZSSG_OUT || process.cwd() + "/dist";
console.log(ROOTDIR, SRCDIR, OUTDIR);
export { ROOTDIR, SRCDIR, OUTDIR };
