import { Errors } from "./common/errors";
import { parseConfig, parsePages } from "./parsers";
import { renderFileSystem, renderPages } from "./renderers";

function buildDocs(args: string[]) {
    if (args.length !== 1) {
        Errors.register("Expected exactly 1 command line argument");
        return;
    }

    const configPath = args[0];
    const config = parseConfig(configPath);
    if (config === undefined) {
        return;
    }

    const fileSystem = renderFileSystem(config);
    const pages = parsePages(config);

    if (fileSystem === undefined || pages === undefined) {
        return;
    }

    renderPages(pages, config, fileSystem.stylesDir);
}

function runAsCLI(args: string[]) {
    Errors.reset();
    buildDocs(args);
    Errors.flush();
    if (Errors.anyErrors()) {
        process.exit(1);
    }
}

runAsCLI(process.argv.slice(2));
