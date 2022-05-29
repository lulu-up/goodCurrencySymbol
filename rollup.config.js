import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

let defaults = { compilerOptions: { declaration: true } };
let override = { compilerOptions: { declaration: false } };

export default {
	input: 'src/index.ts',
	output: [
		{ file: pkg.main, format: 'umd', name: 'index' },
		{ file: pkg.module, format: 'esm', name: 'index' }
	],
	plugins: [
		typescript({
			tsconfigDefaults: defaults,
			tsconfig: "tsconfig.json",
			tsconfigOverride: override,
			clean: true
		})
	]
};