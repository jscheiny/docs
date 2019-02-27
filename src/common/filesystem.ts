import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { Errors } from "./errors";

interface FileSystem {
    readFile: (path: string) => string | undefined;
    readDir: (path: string) => string[] | undefined;
    writeFile: (path: string, day: any) => void;
    copyFile: (src: string, dest: string) => void;
    mkdir: (path: string) => void;
    exists: (path: string) => boolean;
    isDirectory: (path: string) => boolean;
}

export const FS: FileSystem = {
    readFile: wrap((path: string) => readFileSync(path, "UTF8"), path => `Could not read file "${path}"`),
    readDir: wrap((path: string) => readdirSync(path), path => `Could not read contents of directory "${path}"`),
    copyFile: wrap(
        (src: string, dest: string) => copyFileSync(src, dest),
        (src, dest) => `Could not copy file from "${src}" to "${dest}"`,
    ),
    writeFile: wrap(
        (path: string, data: any) => writeFileSync(path, data),
        path => `Could not write to file at "${path}"`,
    ),
    mkdir: mkdirSync,
    exists: existsSync,
    isDirectory: path => statSync(path).isDirectory(),
};

function wrap<A extends any[], R>(fn: (...args: A) => R, message: (...args: A) => string) {
    return (...args: A): R | undefined => {
        try {
            return fn(...args);
        } catch {
            Errors.register(message(...args));
            return undefined;
        }
    };
}
