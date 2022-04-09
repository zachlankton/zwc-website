import fs from "fs";
import hljs from "highlight.js";
import markdownIt from "markdown-it";
import { compileHB } from "./compilehbs.lib.mjs";
const pfs = fs.promises;

var md = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

function errHandler(err) {
  console.error(err);
  process.exit(1);
  return;
}

export async function convertMDFile(fullPath) {
  const txt = await pfs.readFile(fullPath, "utf8").catch(errHandler);
  return await convertMD(txt);
}

export async function convertMD(txt) {
  const mkd = await compileHB(txt);
  return md.render(mkd);
}
