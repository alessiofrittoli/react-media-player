import { reactProfile } from '@alessiofrittoli/package-configs/eslint/profiles/react'
import { eslintConfig } from '@alessiofrittoli/package-configs/eslint'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default eslintConfig(
	...reactProfile,
	...fixupConfigRules(compat.extends('plugin:react-server-components/recommended')),
)
