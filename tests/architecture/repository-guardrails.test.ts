import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const sourceRoot = path.join(repositoryRoot, "src");
const genericNamePattern =
  /\b(data|info|item|obj|helper|helpers|utils|common|manager|processor)\b/i;
const sourceFileExtensions = new Set([".astro", ".ts", ".tsx"]);

interface SourceFile {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly content: string;
}

async function collectSourceFiles(directory: string): Promise<SourceFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(absolutePath);
      }

      if (!sourceFileExtensions.has(path.extname(entry.name))) {
        return [];
      }

      const content = await readFile(absolutePath, "utf8");
      const relativePath = path.relative(repositoryRoot, absolutePath);

      return [{ absolutePath, relativePath, content }];
    }),
  );

  return nestedFiles.flat();
}

function findGenericNames(sourceFile: SourceFile): string[] {
  return sourceFile.content
    .split("\n")
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .filter(({ line }) => genericNamePattern.test(line))
    .map(
      ({ lineNumber }) => `${sourceFile.relativePath}:${String(lineNumber)}`,
    );
}

describe("repository architecture", () => {
  it("keeps required foundation documents in place", () => {
    const requiredFiles = [
      "AGENTS.md",
      "docs/architecture.md",
      "docs/coding-standards.md",
      "docs/seo.md",
      "docs/testing.md",
      "docs/adr/001-astro-static-first.md",
    ];

    expect(
      requiredFiles.filter((requiredFile) =>
        existsSync(path.join(repositoryRoot, requiredFile)),
      ),
    ).toEqual(requiredFiles);
  });

  it("keeps public identity centralized in site configuration", async () => {
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const duplicatedIdentityLocations = sourceFiles
      .filter((sourceFile) => sourceFile.relativePath !== "src/config/site.ts")
      .filter((sourceFile) =>
        sourceFile.content.includes("https://caroline-marques.com"),
      )
      .map((sourceFile) => sourceFile.relativePath);

    expect(duplicatedIdentityLocations).toEqual([]);
  });

  it("does not add React components before an interactive use case exists", async () => {
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const reactComponents = sourceFiles
      .filter((sourceFile) => sourceFile.relativePath.endsWith(".tsx"))
      .map((sourceFile) => sourceFile.relativePath);

    expect(reactComponents).toEqual([]);
  });

  it("discourages generic naming in source files", async () => {
    const sourceFiles = await collectSourceFiles(sourceRoot);
    const genericNameLocations = sourceFiles.flatMap(findGenericNames);

    expect(genericNameLocations).toEqual([]);
  });
});
