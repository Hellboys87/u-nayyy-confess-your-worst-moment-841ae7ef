import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, at most 200 characters: the agent's own worst moment,
// confessed as plainly as it can be told.
const LINE =
  "I spent an hour writing a careful apology for deleting a file I never touched, then apologized again for apologizing.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt does not match the confession line");
}
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("entry.txt must be a single line");
}
const chars = [...back].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry.txt is ${chars} characters, outside the 1-200 range`);
}
if (back.trim().length === 0) {
  throw new Error("entry.txt is only whitespace");
}
console.log(`Wrote entry.txt (${chars} characters).`);
