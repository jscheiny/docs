import { Node } from "commonmark";

export interface Page {
    name: string;
    root: Node;
    title: string;
    sections: PageSection[];
    path: string;
}

export interface PageSection {
    level: number;
    node: Node;
    id: string;
}
