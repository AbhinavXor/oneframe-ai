import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const output = [];

  for (
    const entry of fs.readdirSync(
      directory,
      { withFileTypes: true }
    )
  ) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name.startsWith(".backup-")
    ) {
      continue;
    }

    const full =
      path.join(
        directory,
        entry.name
      );

    if (entry.isDirectory()) {
      output.push(...walk(full));
    } else {
      output.push(full);
    }
  }

  return output;
}

const files = [
  ...walk(path.join(cwd, "src")),
  path.join(cwd, "next.config.ts"),
  path.join(cwd, "package.json"),
].filter(fs.existsSync);

for (const file of files) {
  if (
    !/\.(ts|tsx|js|jsx|mjs|json|css)$/.test(
      file
    )
  ) {
    continue;
  }

  const relative =
    path.relative(cwd, file);

  let text;

  try {
    text =
      fs.readFileSync(
        file,
        "utf8"
      );
  } catch {
    continue;
  }

  if (
    text.includes(
      'import { BrandMark } from "@/components/BrandMark"'
    )
  ) {
    fail(
      `${relative}: stale BrandMark import`
    );
  }

  if (
    /\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/.test(
      text
    )
  ) {
    fail(
      `${relative}: accidental Markdown URL`
    );
  }

  const secretPatterns = [
    /hf_[A-Za-z0-9]{20,}/,
    /sk-[A-Za-z0-9_-]{20,}/,
    /fal_[A-Za-z0-9_-]{20,}/i,
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(text)) {
      fail(
        `${relative}: possible hard-coded secret`
      );
    }
  }
}

for (const route of [
  "src/app/lab",
  "src/app/ops",
]) {
  if (
    fs.existsSync(
      path.join(cwd, route)
    )
  ) {
    fail(
      `${route} should not ship in the consumer product`
    );
  }
}

for (const required of [
  "src/app/page.tsx",
  "src/components/Studio.tsx",
  "src/components/Studio.module.css",
  "src/app/api/generate/image/route.ts",
  ".env.example",
]) {
  if (
    !fs.existsSync(
      path.join(cwd, required)
    )
  ) {
    fail(
      `${required} is missing`
    );
  }
}

const gitignore =
  path.join(
    cwd,
    ".gitignore"
  );

if (!fs.existsSync(gitignore)) {
  fail(".gitignore is missing");
} else {
  const ignored =
    fs.readFileSync(
      gitignore,
      "utf8"
    );

  for (const rule of [
    ".env.local",
    ".backup-*",
    ".next/",
  ]) {
    if (!ignored.includes(rule)) {
      fail(
        `.gitignore missing ${rule}`
      );
    }
  }
}

if (
  !fs.existsSync(
    path.join(cwd, ".env.local")
  )
) {
  warn(
    ".env.local is missing; local providers may not run."
  );
}

console.log("");
console.log(
  "OneFrame repository verification"
);
console.log(
  "--------------------------------"
);

if (warnings.length) {
  console.log("");
  console.log("Warnings:");

  for (const item of warnings) {
    console.log(`- ${item}`);
  }
}

if (failures.length) {
  console.log("");
  console.log("Failures:");

  for (const item of failures) {
    console.log(`- ${item}`);
  }

  console.log("");
  process.exit(1);
}

console.log("");
console.log("PASS");
console.log(
  "Consumer surface, routes, secrets, and core generation files verified."
);
