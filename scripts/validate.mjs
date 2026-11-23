import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const path = new URL("../prototype/index.html", import.meta.url);
const html = readFileSync(path, "utf8");
const checks = [
  ["Portuguese document language", /<html lang="pt-BR">/],
  ["responsive viewport", /name="viewport"/],
  ["catalog container", /id="catalog"/],
  ["account safety notice", /não pede sua senha, e-mail ou token/],
  ["QR pairing not falsely advertised", /Vinculação ainda não habilitada/],
  ["gamepad support is feature-detected", /navigator\.getGamepads/],
  ["keyboard navigation exists", /ArrowRight/],
  ["demo disclaimer is visible", /Prévia de interface/]
];

let failures = 0;
for (const [name, pattern] of checks) {
  const ok = pattern.test(html);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) failures++;
}

const scripts = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/gi)];
if (scripts.length !== 1 || !html.includes('from "./stremio-addon-client.mjs"')) {
  console.error("FAIL expected one inline module and the Stremio client import");
  failures++;
} else {
  try {
    const inlineSource = scripts[0][1].replace(/^import .*;\s*$/m, "");
    new Script(inlineSource, { filename: "prototype/index.html:inline-module" });
    console.log("PASS inline module JavaScript syntax");
  } catch (error) {
    console.error("FAIL inline module JavaScript syntax");
    console.error(error.message);
    failures++;
  }
}

try {
  const clientPath = new URL("../prototype/stremio-addon-client.mjs", import.meta.url);
  const clientSource = readFileSync(clientPath, "utf8").replace(/^export /gm, "");
  new Script(clientSource, { filename: "prototype/stremio-addon-client.mjs" });
  console.log("PASS Stremio client JavaScript syntax");
} catch (error) {
  console.error("FAIL Stremio client JavaScript syntax");
  console.error(error.message);
  failures++;
}

if (failures) {
  console.error(`\n${failures} validation check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("\nAll static validation checks passed.");
}
