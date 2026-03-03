import { defineConfig } from 'tsup'

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
	minify		: isProduction,
	sourcemap	: ! isProduction,
} )