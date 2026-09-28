import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import packageManifest from "../../package.json";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const eslint = new ESLint({ cwd: repositoryRoot });

async function lintAstro(source: string): Promise<ESLint.LintResult[]> {
  return eslint.lintText(source, { filePath: "src/pages/projects.astro" });
}

describe("lint configuration", () => {
  it("rejects imports after executable Astro frontmatter", async () => {
    const results = await lintAstro(`---
const title = "Example";
import { siteIdentity } from "@config/site";
---
<h1>{title} {siteIdentity.name}</h1>`);
    expect(
      results.flatMap((result) =>
        result.messages.map((message) => message.ruleId),
      ),
    ).toContain("import-x/first");
  });

  it("enforces import ordering in Astro frontmatter", async () => {
    const results = await lintAstro(`---
import { siteIdentity } from "@config/site";
import { currentSnapshot } from "@config/current";
---
<h1>{siteIdentity.name} {currentSnapshot.reading.title}</h1>`);
    expect(
      results.flatMap((result) =>
        result.messages.map((message) => message.ruleId),
      ),
    ).toContain("import-x/order");
  });

  it("reports inaccessible Astro images", async () => {
    const results = await lintAstro('<img src="/example.png" />');
    expect(
      results.flatMap((result) =>
        result.messages.map((message) => message.ruleId),
      ),
    ).toContain("astro/jsx-a11y/alt-text");
  });

  it("accepts an accessible Astro image", async () => {
    const results = await lintAstro(
      '<img src="/example.png" alt="A snowy mountain" />',
    );
    expect(results.flatMap((result) => result.messages)).toEqual([]);
  });

  it("fails the lint command on warnings without errors", () => {
    const [command, ...lintArguments] = packageManifest.scripts.lint.split(" ");
    expect(command).toBe("eslint");
    const eslintRoot = path.dirname(
      fileURLToPath(import.meta.resolve("eslint/package.json")),
    );
    const result = spawnSync(
      process.execPath,
      [
        path.join(eslintRoot, "bin/eslint.js"),
        ...lintArguments.filter((argument) => argument !== "."),
        "--stdin",
        "--stdin-filename",
        "src/pages/projects.astro",
        "--format",
        "json",
      ],
      {
        cwd: repositoryRoot,
        input: '---\nconsole.log("warning probe");\n---\n<p>Example</p>',
        encoding: "utf8",
        timeout: 15_000,
      },
    );
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('"ruleId":"no-console"');
    expect(result.stdout).toContain('"errorCount":0');
    expect(result.stdout).toContain('"warningCount":1');
  }, 20_000);
});
