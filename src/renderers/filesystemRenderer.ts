import { join } from "path";
import { Errors } from "../common/errors";
import { FS } from "../common/filesystem";
import { DocsConfig } from "../models";

export function renderFileSystem({ outputDir }: DocsConfig): { stylesDir: string } | undefined {
    if (!FS.exists(outputDir)) {
        FS.mkdir(outputDir);
    } else if (!FS.isDirectory(outputDir)) {
        Errors.register(`Output directory "${outputDir}" is not a directory`);
        return undefined;
    }

    const stylesDir = join(outputDir, "styles");
    if (!FS.exists(stylesDir)) {
        FS.mkdir(stylesDir);
    } else if (!FS.isDirectory(stylesDir)) {
        Errors.register(`Styles directory "${stylesDir}" is not a directory`);
        return undefined;
    }

    return { stylesDir };
}
