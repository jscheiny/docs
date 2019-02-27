import { Node } from "commonmark";
import { Page } from "../models/pageModel";

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
    public register(message: string, node: Node, page: Page): void;
    public register(message: string, node?: Node, page?: Page) {
        this.count += 1;
        if (node === undefined || page === undefined) {
            this.errors.push(message);
        } else if (!(page.sourcePath in this.sourcedErrors)) {
            this.sourcedErrors[page.sourcePath] = [{ node, message }];
        } else {
            this.sourcedErrors[page.sourcePath].push({ node, message });
        }
    }

    public flush() {
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
