const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");

const dataSource = read("src/data.js");
const scoringSource = read("src/scoring.js");

const data = new Function(
  dataSource +
  "\nreturn { questionScores, questionCopy, archetypes, archetypeEn, uiCopy, duoCopy, visualProfiles };"
)();

const { ghostKeyFromScores } = new Function(
  scoringSource + "\nreturn { ghostKeyFromScores };"
)();

assert.equal(data.questionScores.length, 8, "expected 8 scoring questions");
assert.equal(data.questionCopy.ko.length, 8, "expected 8 Korean questions");
assert.equal(data.questionCopy.en.length, 8, "expected 8 English questions");

for (const language of ["ko", "en"]) {
  for (const [index, q] of data.questionCopy[language].entries()) {
    assert.equal(q.a.length, 4, `${language} question ${index + 1} must have 4 choices`);
  }
}
for (const [index, q] of data.questionScores.entries()) {
  assert.equal(q.length, 4, `scoring question ${index + 1} must have 4 choices`);
}

const archetypeKeys = Object.keys(data.archetypes).sort();
assert.equal(archetypeKeys.length, 16, "expected 16 archetypes");
assert.deepEqual(Object.keys(data.visualProfiles).sort(), archetypeKeys, "visual profiles must match archetypes");
assert.deepEqual(Object.keys(data.archetypeEn).sort(), archetypeKeys, "English archetypes must match archetypes");

for (const key of archetypeKeys) {
  const en = data.archetypeEn[key];
  for (const field of ["job", "desire", "fear", "object", "line", "decision"]) {
    assert.ok(typeof en[field] === "string" && en[field].trim().length > 0, `${key} missing English ${field}`);
  }
}

assert.deepEqual(
  Object.keys(data.uiCopy.ko).sort(),
  Object.keys(data.uiCopy.en).sort(),
  "KR/EN UI copy keys must match"
);

for (const language of ["ko", "en"]) {
  assert.equal(data.duoCopy[language].scenes.length, 8, `${language} duo scenes must have 8 entries`);
  assert.equal(data.duoCopy[language].reasons.length, 4, `${language} duo reasons must have 4 entries`);
  assert.equal(data.duoCopy[language].clashes.length, 4, `${language} duo clashes must have 4 entries`);
}

function scorePath(pathChoices) {
  const scores = {
    stay: 0, leave: 0,
    order: 0, impulse: 0,
    hidden: 0, seen: 0,
    build: 0, experience: 0,
  };

  pathChoices.forEach((choice, questionIndex) => {
    for (const [axis, value] of Object.entries(data.questionScores[questionIndex][choice])) {
      scores[axis] += value;
    }
  });

  return ghostKeyFromScores(scores, pathChoices);
}

const counts = Object.fromEntries(archetypeKeys.map(key => [key, 0]));

for (let n = 0; n < 4 ** 8; n += 1) {
  let x = n;
  const choices = Array(8);
  for (let i = 7; i >= 0; i -= 1) {
    choices[i] = x % 4;
    x = Math.floor(x / 4);
  }
  const key = scorePath(choices);
  assert.ok(key in counts, `unrecognized archetype key: ${key}`);
  counts[key] += 1;
}

for (const key of archetypeKeys) {
  assert.equal(counts[key], 4096, `${key} should be reachable by exactly 4096 paths`);
}

for (const requiredPath of [
  "index.html",
  "styles/main.css",
  "src/data.js",
  "src/scoring.js",
  "src/analytics.js",
  "src/app.js",
  "privacy.html",
  "LICENSE",
]) {
  assert.ok(fs.existsSync(path.join(root, requiredPath)), `missing ${requiredPath}`);
}

const index = read("index.html");
for (const src of ["src/data.js", "src/scoring.js", "src/analytics.js", "src/app.js"]) {
  assert.ok(index.includes(`src="${src}"`), `index.html does not load ${src}`);
}
assert.ok(index.includes('href="styles/main.css"'), "index.html does not load styles/main.css");

console.log("GHOSTLIFE QA PASS");
console.log("• 8 questions × 4 choices in KR/EN");
console.log("• 16 archetypes + 16 visual profiles");
console.log("• 65,536 paths checked");
console.log("• every archetype reachable exactly 4,096 times");
