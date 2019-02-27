import { Node, Parser } from "commonmark";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, extname, join } from "path";
import { Errors } from "../common/errors";
import { createNodeId, getNodeText, nextStep, walkMarkdown } from "../common/markdownUtils";
import { DocsConfig, Page, PageSection } from "../models";

export function parsePages(config: DocsConfig): Page[] | undefined {
    const { inputDir, pageOrder } = config;
    if (!existsSync(inputDir)) {
        Errors.register(`Input directory "${inputDir}" does not exist`);
        return undefined;
    }

    if (!statSync(inputDir).isDirectory()) {
        Errors.register(`Input directory "${inputDir}" is not a directory`);
        return undefined;
    }

    const pages = readdirSync(inputDir)
        .filter(path => extname(path).toLowerCase() === ".md")
        .map(path => join(inputDir, path))
        .map(path => parsePage(path, config))
        .sort(orderBy(pageOrder));

    pages.forEach(page => parseErrors(page, pages));

    return pages;
}

function parsePage(sourcePath: string, config: DocsConfig): Page {
    const name = basename(sourcePath, ".md");
    const source = readFileSync(sourcePath, "UTF8");
    const root = markdownParser.parse(source);
    return {
        name,
        root,
        sourcePath,
        title: parseTitle(root, name, config),
        sections: parseSections(root),
        path: `${name}.html`,
    };
}

const markdownParser = new Parser();

function parseTitle(root: Node, name: string, config: DocsConfig) {
    if (name === "index") {
        return config.projectName;
    }
    const fallback = "Untitled";
    const walker = root.walker();

    const maybeDocument = nextStep(walker);
    if (maybeDocument === null || maybeDocument.node.type !== "document") {
        return fallback;
    }

    const maybeHeading = nextStep(walker);
    if (maybeHeading === null || maybeHeading.node.type !== "heading" || maybeHeading.node.level !== 1) {
        return fallback;
    }

    return getNodeText(maybeHeading.node);
}

function parseSections(root: Node): PageSection[] {
    let sections: PageSection[] = [];
    walkMarkdown(root, node => {
        if (node.type === "heading" && node.level !== 1) {
            sections.push({
                node,
                level: node.level,
                id: createNodeId(node),
            });
        }
    });
    return sections;
}

function orderBy(pageOrder: string[] = []): (a: Page, b: Page) => number {
    const getIndex = (page: Page) => {
        // Index page always goes first
        if (page.name === "index") {
            return -Infinity;
        }
        // Check for the page name then for the wildcard
        let index = pageOrder.indexOf(page.name);
        if (index === -1) {
            index = pageOrder.indexOf("*");
        }
        return index === -1 ? Infinity : index;
    };

    return (a, b) => {
        const aIndex = getIndex(a);
        const bIndex = getIndex(b);
        if (aIndex < bIndex) {
            return -1;
        } else if (aIndex > bIndex) {
            return 1;
        } else {
            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
        }
    };
}

function parseErrors(page: Page, pages: Page[]) {
    walkMarkdown(page.root, node => {
        if (node.type === "link" && node.destination && !isExternalDestination(node.destination)) {
            const destPath = node.destination.split("#")[0];
            if (!destPath) {
                return;
            }
            const foundPage = pages.find(page => basename(page.path) === destPath);
            if (!foundPage) {
                Errors.register(`Could not find page "${destPath}"`, node, page);
            }
        }
    });
}

function isExternalDestination(dest: string) {
    return dest.startsWith("https://") || dest.startsWith("http://") || dest.startsWith("mailto:");
}
