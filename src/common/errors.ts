import { Node } from "commonmark";

class ErrorsService {
    private count: number = 0;
    private errors: string[] = [];
    private sourcedErrors: SourcedErrors = {};

    public reset() {
        this.count = 0;
        this.sourcedErrors = {};
        this.errors = [];
    }

    public register(message: string): void;
    public register(message: string, node: Node, path: string): void;
    public register(message: string, node?: Node, path?: string) {
        this.count += 1;
        if (node === undefined || path === undefined) {
            this.errors.push(message);
        } else if (!(path in this.sourcedErrors)) {
            this.sourcedErrors[path] = [];
        } else {
            this.sourcedErrors[path].push({ node, message });
        }
    }

    public flush(): void {
        for (const error of this.errors) {
            printError(error);
        }

        for (const path in this.sourcedErrors) {
            for (const error of this.sourcedErrors[path]) {
                printSourcedError(path, error);
            }
        }

        if (this.count !== 0) {
            console.error(`${this.count} error${this.count === 1 ? "" : "s"} found`);
        }
    }

    public anyErrors() {
        return this.count !== 0;
    }
}

export const Errors = new ErrorsService();

interface SourcedErrors {
    [path: string]: SourcedError[];
}

interface SourcedError {
    node: Node;
    message: string;
}

function printSourcedError(path: string, { node, message }: SourcedError) {
    printError(`${path}:${getLineNumber(node)} - ${message}`);
}

function printError(message: string) {
    console.error(`ERROR: ${message}`);
}

function getLineNumber(node: Node) {
    let current: Node | null = node;
    while (current && current.sourcepos == null) {
        current = current.parent;
    }
    if (current) {
        return current.sourcepos[0][0];
    }
    return 1;
}
