import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "@rollup/plugin-typescript";
import cssimport from "rollup-plugin-cssimport";
import copy from "rollup-plugin-copy";
import externalGlobals from "rollup-plugin-external-globals";

const resources = [
    { src: "node_modules/@patternfly/patternfly/patternfly.min.css", dest: "dist/" },
    { src: "src/authentik.css", dest: "dist/" },

    { src: "node_modules/@patternfly/patternfly/assets/*", dest: "dist/assets/" },
    { src: "src/index.html", dest: "dist" },
    { src: "src/assets/*", dest: "dist/assets" },
    { src: "./icons/*", dest: "dist/assets/icons" },
];
// eslint-disable-next-line no-undef
const isProdBuild = process.env.NODE_ENV === "production";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function manualChunks(id) {
    if (id.includes("node_modules")) {
        if (id.includes("codemirror")) {
            return "vendor-cm";
        }
        return "vendor";
    }
}

export default [
    // Autogenerated API Client
    {
        input: "./api/src/index.ts",
        output: [
            {
                format: "es",
                dir: "./api/dist/",
                sourcemap: true,
            },
        ],
        plugins: [
            typescript(),
            isProdBuild && terser(),
        ].filter(p => p),
        watch: {
            clearScreen: false,
        },
    },
    // Main Application
    {
        input: "./src/main.ts",
        output: [
            {
                format: "es",
                dir: "dist",
                sourcemap: true,
                manualChunks: manualChunks,
            },
        ],
        plugins: [
            cssimport(),
            typescript(),
            externalGlobals({
                django: "django",
            }),
            resolve({ browser: true }),
            commonjs(),
            sourcemaps(),
            isProdBuild && terser(),
            copy({
                targets: [...resources],
                copyOnce: false,
            }),
        ].filter(p => p),
        watch: {
            clearScreen: false,
        },
        external: ["django"]
    },
    // Flow executor
    {
        input: "./src/flow.ts",
        output: [
            {
                format: "es",
                dir: "dist",
                sourcemap: true,
                manualChunks: manualChunks,
            },
        ],
        plugins: [
            cssimport(),
            typescript(),
            externalGlobals({
                django: "django"
            }),
            resolve({ browser: true }),
            commonjs(),
            sourcemaps(),
            isProdBuild && terser(),
            copy({
                targets: [...resources],
                copyOnce: false,
            }),
        ].filter(p => p),
        watch: {
            clearScreen: false,
        },
        external: ["django"]
    },
];
