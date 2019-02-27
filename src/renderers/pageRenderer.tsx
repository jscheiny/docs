import { writeFileSync } from "fs";
import { join } from "path";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { getStyles } from "typestyle";
import { PageBody } from "../components/page";
import { DocsConfig, Page } from "../models";
import { renderLinkedStyles } from "./stylesRenderer";

export function renderPages(pages: Page[], config: DocsConfig, stylesDir: string) {
    const linkedStyles = renderLinkedStyles(config, stylesDir);
    pages.forEach((page, index) => {
        const html = renderPage(pages, index, config, linkedStyles);
        writeFileSync(join(config.outputDir, page.path), html);
    });
}

function renderPage(pages: Page[], index: number, config: DocsConfig, linkedStyles: string) {
    const page = pages[index];
    const body = ReactDOMServer.renderToString(<PageBody pages={pages} pageIndex={index} config={config} />);
    const title = page.name === "index" ? config.projectName : `${page.title} | ${config.projectName}`;
    return renderPageHtml(title, body, getStyles(), linkedStyles);
}

const renderPageHtml = (title: string, body: string, inlineStyles: string, linkedStyles: string) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${inlineStyles}</style>
        ${linkedStyles}
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Ubuntu+Mono" rel="stylesheet">
    </head>
    <body>${body}</body>
</html>`;
