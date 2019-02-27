import { copyFileSync, existsSync } from "fs";
import { basename, join } from "path";
import { Errors } from "../common/errors";
import { DocsConfig } from "../models";

export function renderLinkedStyles(config: DocsConfig, stylesDir: string) {
    return [getHighlightStyleSheetPath(config), "node_modules/normalize.css/normalize.css"]
        .map(path => renderLinkedStyleSheet(path, stylesDir))
        .filter(isPresent)
        .join("\n");
}

function getHighlightStyleSheetPath(config: DocsConfig) {
    const { highlightColorTheme = "monokai" } = config;
    const highlightFileName = highlightColorTheme.endsWith(".css") ? highlightColorTheme : `${highlightColorTheme}.css`;
    return `node_modules/highlight.js/styles/${highlightFileName}`;
}

function renderLinkedStyleSheet(styleSheetPath: string, stylesDir: string): string | undefined {
    if (!existsSync(styleSheetPath)) {
        Errors.register(`Could not find style sheet at ${styleSheetPath}`);
        return undefined;
    }
    const name = basename(styleSheetPath);
    const outPath = join(stylesDir, name);
    copyFileSync(styleSheetPath, outPath);
    return `<link rel="stylesheet" type="text/css" media="screen" href="styles/${name}" />`;
}

function isPresent<T>(value: T | null | undefined): value is T {
    return value != null;
}
