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

function staticExportIsTypeOnly(node: ts.ExportDeclaration): boolean {
  if (node.isTypeOnly) {
    return true;
  }
  const bindings = node.exportClause;
  return (
    bindings !== undefined &&
    ts.isNamedExports(bindings) &&
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
    return {
      specifier: node.moduleSpecifier.text,
      typeOnly: staticExportIsTypeOnly(node),
    };
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

function matchAliasReplacement(
  specifier: string,
  alias: string,
): string | undefined {
  const wildcard = alias.indexOf("*");
  if (wildcard === -1) {
    return specifier === alias ? "" : undefined;
  }
  const prefix = alias.slice(0, wildcard);
  const suffix = alias.slice(wildcard + 1);
  if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) {
    return undefined;
  }
  return specifier.slice(prefix.length, specifier.length - suffix.length);
}

function resolveAliasPath(
  specifier: string,
  options: ts.CompilerOptions,
  repositoryRoot: string,
): string | undefined {
  for (const [alias, targets] of Object.entries(options.paths ?? {})) {
    const replacement = matchAliasReplacement(specifier, alias);
    const target = targets[0];
    if (replacement !== undefined && target !== undefined) {
      return path.resolve(
        options.baseUrl ?? repositoryRoot,
        target.replace("*", replacement),
      );
    }
  }
  return undefined;
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

  if (specifier.startsWith(".")) {
    return path.resolve(path.dirname(filename), specifier);
  }
  return resolveAliasPath(specifier, options, repositoryRoot);
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
