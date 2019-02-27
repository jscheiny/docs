import * as IO from "io-ts";

const GithubConfig = IO.intersection([
    IO.type({
        url: IO.string,
    }),
    IO.partial({
        text: IO.string,
    }),
]);

export type DocsConfig = IO.TypeOf<typeof DocsConfig>;
export const DocsConfig = IO.exact(
    IO.intersection([
        IO.type({
            projectName: IO.string,
            github: GithubConfig,
            inputDir: IO.string,
            outputDir: IO.string,
        }),
        IO.partial({
            pageOrder: IO.array(IO.string),
            highlightColorTheme: IO.string,
            license: IO.type({
                name: IO.string,
                url: IO.string,
            }),
            copyrightName: IO.string,
        }),
    ]),
);
