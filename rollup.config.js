import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import virtual from "@rollup/plugin-virtual";
import serve from "rollup-plugin-serve";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js"
    },
    plugins: [
        svelte({
            dev: !production,
            css: css => {
                css.write("public/build/bundle.css");
            }
        }),

        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),
        commonjs(),
        // virtual({
        //     "rxjs": `
        //         import { fromEvent } from "rxjs";
        //         export const { fromEvent } = rxjs;
        //     `
        //     "rxjs/operators": `
        //        import rxjs from 'rxjs'; 
        //        export const {filter, map, concatMap, tap, share} = rxjs.operators;
        //     `
        // }),

        !production && serve({
            contentBase: "public",
            host: "localhost",
            port: 5000,
            historyApiFallback: true,
        }),

        !production && livereload("public"),

        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
