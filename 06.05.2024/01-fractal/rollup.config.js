import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "src/main.js",
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