import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig( {
	entry		: [ 'src/**/index.(ts|tsx)' ],
	format		: [ 'esm' ],
	dts			: true,
	splitting	: true,
	shims		: true,
	skipNodeModulesBundle: true,
	clean		: true,
	platform	: 'browser',
	target		: tsconfig.compilerOptions.target,
	minify		: isProduction,
	sourcemap	: ! isProduction,
} )