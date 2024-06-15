import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./index.js",
    output: {
        dir: "output",
        format: "iife",
        name: "main.js"
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true
        })
    ]
}