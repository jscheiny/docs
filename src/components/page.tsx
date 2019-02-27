import * as React from "react";
import { DocsConfig, Page } from "../models";
import { Link, Markdown } from "./markdown";
import { Sidebar } from "./sidebar";
import { component } from "./style";

interface PageBodyProps {
    config: DocsConfig;
    pages: Page[];
    pageIndex: number;
}

export const PageBody: React.FunctionComponent<PageBodyProps> = ({ config, pages, pageIndex }) => {
    const page = pages[pageIndex];
    return (
        <Container>
            <Sidebar config={config} pages={pages} selectedIndex={pageIndex} />
            <Contents>
                <Body>
                    <div id="top" />
                    <Markdown root={page.root} />
                    <EndMatter>
                        FILL IN THE END MATTER SOMEHOW
                        <License>
                            <LicenseText config={config} />
                            <CopyrightText config={config} />
                        </License>
                    </EndMatter>
                </Body>
            </Contents>
        </Container>
    );
};

const LicenseText: React.FunctionComponent<{ config: DocsConfig }> = ({ config }) => {
    const { license, projectName } = config;
    if (license === undefined) {
        return <></>;
    }
    return (
        <div>
            {projectName} is distributed under the <Link href={license.url}>{license.name}</Link>
        </div>
    );
};

const CopyrightText: React.FunctionComponent<{ config: DocsConfig }> = ({ config }) => {
    const { copyrightName } = config;
    if (copyrightName === undefined) {
        return <></>;
    }
    const year = new Date().getFullYear();
    return (
        <div>
            Copyright © {year} by {copyrightName}
        </div>
    );
};

const Container = component("page", "div", {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
});

const Contents = component("contents", "div", {
    overflow: "auto",
    flex: "1 1 auto",
    position: "relative",
    background: "#EBF1F5",
    boxShadow: "inset 15px 0 20px -20px #182026",
});

const Body = component("body", "div", {
    maxWidth: 800,
    margin: "0 25px 25px 45px",
});

const EndMatter = component("end-matter", "div", {
    borderTop: "1px solid #BFCCD6",
    marginTop: 20,
    paddingTop: 20,
    fontSize: 14,
});

const License = component("license", "div", {
    marginTop: 20,
    textAlign: "center",
    color: "#738694",
    textShadow: "0 1px 0 white",
    fontSize: 12,
});
