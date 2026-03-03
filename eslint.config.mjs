import { dirname } from 'path'
import { fileURLToPath } from 'url'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'

// Initial file generated with `npm lint -- --init`

const __filename	= fileURLToPath( import.meta.url )
const __dirname		= dirname( __filename )

const compat = new FlatCompat( {
	baseDirectory: __dirname,
} )


/** @type {import('eslint').Linter.Config[]} */
const config = [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...fixupConfigRules( compat.extends( 'plugin:react/recommended' ) ),
	...fixupConfigRules( compat.extends( 'plugin:react-hooks/recommended' ) ),
	...fixupConfigRules( compat.extends( 'plugin:react-server-components/recommended' ) ),
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{ files: [ 'src/**/*.{js,jsx,mjs,cjs,ts,tsx}' ] },
	{ ignores: [ 'dist', 'scripts', 'coverage' ] },
	{ rules: {
		'@typescript-eslint/no-namespace': 'off',
		'react-hooks/set-state-in-effect': 'warn',
		'react-hooks/refs': 'warn',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
	} },
]

export default config