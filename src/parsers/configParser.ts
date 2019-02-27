import { readFileSync } from "fs";
import { PathReporter } from "io-ts/lib/PathReporter";
import { Errors } from "../common/errors";
import { DocsConfig } from "../models";

export function parseConfig(path: string): DocsConfig | undefined {
    const configSource = readFileSync(path, "UTF8");
    const json = JSON.parse(configSource);
    const decoded = DocsConfig.decode(json);
    if (decoded.isRight()) {
        return decoded.value;
    }
    Errors.register(PathReporter.report(decoded).join("\n"));
    return undefined;
}
