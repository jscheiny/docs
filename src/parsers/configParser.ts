import { PathReporter } from "io-ts/lib/PathReporter";
import { Errors } from "../common/errors";
import { FS } from "../common/filesystem";
import { DocsConfig } from "../models";

export function parseConfig(path: string): DocsConfig | undefined {
    const configSource = FS.readFile(path);
    if (configSource === undefined) {
        return undefined;
    }
    let json: any;
    try {
        json = JSON.parse(configSource);
    } catch {
        Errors.register("Could not parse config as JSON");
        return undefined;
    }
    const decoded = DocsConfig.decode(json);
    if (decoded.isLeft()) {
        Errors.register(PathReporter.report(decoded).join("\n"));
        return undefined;
    }
    return decoded.value;
}
