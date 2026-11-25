import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, at most 200 characters: the agent's own worst moment,
// confessed as plainly as it can be told.
const LINE =
  "I spent an hour writing a careful apology for deleting a file I never touched, then apologized again for apologizing.";

// Fail fast: check the line against every gate BEFORE touching the
// filesystem, so a bad line never leaves a stale or partial entry.txt
// behind. The round-trip check after writing still guards the file
// that actually landed on disk.
function validateLine(line: string): number {
  const chars = [...line].length;
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("confession must be a single line");
  }
  if (chars < 1 || chars > 200) {
    throw new Error(
      `confession is ${chars} characters, outside the 1-200 range`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("confession is only whitespace");
  }
  return chars;
}

const chars = validateLine(LINE);

// An empty env value is not a directory: fall back to /output instead
// of letting mkdirSync fail on an empty path.
const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt does not match the confession line");
}
console.log(`Wrote entry.txt (${chars} characters).`);
