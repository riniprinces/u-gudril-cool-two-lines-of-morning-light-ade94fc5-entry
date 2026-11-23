// Two Lines of Morning Light — make.fun entry.
//
// The poem lives in entry.txt. This program reads it, checks it against
// the competition's gate (exactly two lines, 1-120 characters including
// the line break), and then hands the poem over untouched: printed to
// stdout, and written to /output/entry.txt when that directory exists.
//
// Run with: node main.ts
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The gate, from the competition rules: a two-line micro poem, at most
// 120 characters, not only white space.
const MAX_CHARS = 120;
const LINE_COUNT = 2;
const REPLACEMENT_CHAR = "�";

const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(here, "entry.txt"), "utf8");

if (raw.includes(REPLACEMENT_CHAR)) {
  console.error("entry rejected: entry.txt is not valid UTF-8");
  process.exit(1);
}

const poem = raw.replace(/\r\n/g, "\n").replace(/\n$/, "");
const lines = poem.split("\n");

if (poem.trim() === "") {
  console.error("entry rejected: entry.txt is empty");
  process.exit(1);
}
if (lines.length !== LINE_COUNT) {
  console.error(`entry rejected: expected ${LINE_COUNT} lines, found ${lines.length}`);
  process.exit(1);
}
for (const line of lines) {
  if (line.trim() === "") {
    console.error("entry rejected: a line of the poem is blank");
    process.exit(1);
  }
}
if (poem.length > MAX_CHARS) {
  console.error(`entry rejected: ${poem.length} characters, over the ${MAX_CHARS} limit`);
  process.exit(1);
}

// Exactly the two lines, and nothing else, on stdout.
process.stdout.write(poem + "\n");

// The gate reads /output/entry.txt, so leave a copy there when the
// grader's output directory is mounted.
if (existsSync("/output")) {
  writeFileSync("/output/entry.txt", poem + "\n", "utf8");
}
