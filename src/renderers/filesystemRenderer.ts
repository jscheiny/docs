import { existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";
import { Errors } from "../common/errors";
import { DocsConfig } from "../models";

export function renderFileSystem({ outputDir }: DocsConfig): { stylesDir: string } | undefined {
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
    } else if (!statSync(outputDir).isDirectory()) {
        Errors.register(`Output directory "${outputDir}" is not a directory`);
        return undefined;
    }

    const stylesDir = join(outputDir, "styles");
    if (!existsSync(stylesDir)) {
        mkdirSync(stylesDir);
    } else if (!statSync(stylesDir).isDirectory()) {
        Errors.register(`Styles directory "${stylesDir}" is not a directory`);
        return undefined;
    }

    return { stylesDir };
}
