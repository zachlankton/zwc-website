import "dotenv/config";

const ROOTDIR = process.env.ZSSG_ROOT || "";
const SRCDIR = process.env.ZSSG_SRC || "src";
const OUTDIR = process.env.ZSSG_OUT || "dist";
export { ROOTDIR, SRCDIR, OUTDIR };
