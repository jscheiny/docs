import * as commandLineArgs from "command-line-args";
import { Errors } from "./common/errors";
import { parseConfig, parsePages } from "./parsers";
import { renderFileSystem, renderPages } from "./renderers";

interface CommandLineArgs {
    config: string;
    dev: boolean;
}

function buildDocs(args: CommandLineArgs) {
    const config = parseConfig(args.config);
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

function runAsCLI() {
    const args = commandLineArgs([
        { name: "config", alias: "c", type: String },
        { name: "dev", type: Boolean },
    ]) as CommandLineArgs;

    Errors.reset();
    buildDocs(args);
    Errors.flush();
    if (Errors.anyErrors()) {
        process.exit(1);
    }
}

runAsCLI();
