import path from "node:path";

import ts from "typescript";

interface ImportReference {
  readonly specifier: string;
  readonly typeOnly: boolean;
}

function staticImportIsTypeOnly(clause: ts.ImportClause | undefined): boolean {
  if (clause === undefined) {
    return false;
  }
  if (clause.phaseModifier === ts.SyntaxKind.TypeKeyword) {
    return true;
  }
  const bindings = clause.namedBindings;
  return (
    clause.name === undefined &&
    bindings !== undefined &&
    ts.isNamedImports(bindings) &&
    bindings.elements.length > 0 &&
    bindings.elements.every((binding) => binding.isTypeOnly)
  );
}

function staticImportReference(node: ts.Node): ImportReference | undefined {
  if (
    ts.isImportDeclaration(node) &&
    ts.isStringLiteral(node.moduleSpecifier)
  ) {
    return {
      specifier: node.moduleSpecifier.text,
      typeOnly: staticImportIsTypeOnly(node.importClause),
    };
  }
  if (
    ts.isExportDeclaration(node) &&
    node.moduleSpecifier !== undefined &&
    ts.isStringLiteral(node.moduleSpecifier)
  ) {
    const bindings = node.exportClause;
    const typeOnly =
      node.isTypeOnly ||
      (bindings !== undefined &&
        ts.isNamedExports(bindings) &&
        bindings.elements.length > 0 &&
        bindings.elements.every((binding) => binding.isTypeOnly));
    return { specifier: node.moduleSpecifier.text, typeOnly };
  }
  return undefined;
}

function dynamicImportReference(node: ts.Node): ImportReference | undefined {
  if (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword
  ) {
    const argument = node.arguments[0];
    if (argument !== undefined && ts.isStringLiteralLike(argument)) {
      return { specifier: argument.text, typeOnly: false };
    }
  }
  if (
    ts.isImportTypeNode(node) &&
    ts.isLiteralTypeNode(node.argument) &&
    ts.isStringLiteral(node.argument.literal)
  ) {
    return { specifier: node.argument.literal.text, typeOnly: true };
  }
  return undefined;
}

function collectImportReferences(
  source: string,
  filename: string,
): ImportReference[] {
  const syntax = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const references: ImportReference[] = [];
  function visit(node: ts.Node): void {
    const reference =
      staticImportReference(node) ?? dynamicImportReference(node);
    if (reference !== undefined) {
      references.push(reference);
    }
    ts.forEachChild(node, visit);
  }
  visit(syntax);
  return references;
}

function resolveSourcePath(
  specifier: string,
  filename: string,
  options: ts.CompilerOptions,
  repositoryRoot: string,
): string | undefined {
  const resolved = ts.resolveModuleName(
    specifier,
    filename,
    options,
    ts.sys,
  ).resolvedModule;
  if (resolved !== undefined) {
    return resolved.resolvedFileName;
  }
  // TypeScript does not resolve Astro and image files. Still check their source-layer boundaries.
  if (specifier.startsWith(".")) {
    return path.resolve(path.dirname(filename), specifier);
  }
  for (const [alias, targets] of Object.entries(options.paths ?? {})) {
    const wildcard = alias.indexOf("*");
    const prefix = wildcard === -1 ? alias : alias.slice(0, wildcard);
    const suffix = wildcard === -1 ? "" : alias.slice(wildcard + 1);
    const matches =
      wildcard === -1
        ? specifier === alias
        : specifier.startsWith(prefix) && specifier.endsWith(suffix);
    const target = targets[0];
    if (matches && target !== undefined) {
      const replacement = specifier.slice(
        prefix.length,
        specifier.length - suffix.length,
      );
      return path.resolve(
        options.baseUrl ?? repositoryRoot,
        target.replace("*", replacement),
      );
    }
  }
  return undefined;
}

function sourceScripts(source: string, filename: string): string[] {
  if (!filename.endsWith(".astro")) {
    return [source];
  }
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/u.exec(source)?.[1];
  const scripts = Array.from(
    source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gu),
    (match) => match[1] ?? "",
  );
  return [frontmatter ?? "", ...scripts];
}

function isForbiddenSourceLayer(
  sourceLayer: string | undefined,
  targetLayer: string | undefined,
): boolean {
  if (sourceLayer === "config") {
    return targetLayer !== "config";
  }
  if (sourceLayer === "lib") {
    return targetLayer !== "lib" && targetLayer !== "config";
  }
  return (
    sourceLayer === "components" &&
    (targetLayer === "pages" || targetLayer === "layouts")
  );
}

export function findDependencyViolations(
  source: string,
  relativePath: string,
  repositoryRoot: string,
  options: ts.CompilerOptions,
): string[] {
  const filename = path.resolve(repositoryRoot, relativePath);
  const sourceLayer = relativePath.split("/")[1];
  const references = sourceScripts(source, filename).flatMap((script) =>
    collectImportReferences(script, filename),
  );
  return references
    .filter((reference) => {
      if (
        (sourceLayer === "lib" || sourceLayer === "config") &&
        /^(?:astro:|astro\/(?:loaders|assets)(?:\/|$))/u.test(
          reference.specifier,
        ) &&
        !reference.typeOnly
      ) {
        return true;
      }
      const resolvedPath = resolveSourcePath(
        reference.specifier,
        filename,
        options,
        repositoryRoot,
      );
      if (resolvedPath === undefined) {
        return false;
      }
      const targetPath = path.relative(
        path.join(repositoryRoot, "src"),
        resolvedPath,
      );
      if (targetPath.startsWith("..") || path.isAbsolute(targetPath)) {
        return false;
      }
      const targetLayer = targetPath.split(path.sep)[0];
      return isForbiddenSourceLayer(sourceLayer, targetLayer);
    })
    .map((reference) => `${relativePath}: ${reference.specifier}`);
}
