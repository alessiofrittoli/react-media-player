import type { JestConfigWithTsJest } from 'ts-jest'
import dotenv from 'dotenv'

console.log(
`
________________________________________________________________________________________________________________________________________
        ____                  __     _   __          __        __  ___          __      __        _____ __             __
       / __ \\___  ____  _____/ /_   / | / /___  ____/ /__     /  |/  /___  ____/ /_  __/ /__     / ___// /_____  _____/ /____  _____
      / /_/ / _ \\/ __ \\/ ___/ __/  /  |/ / __ \\/ __  / _ \\   / /|_/ / __ \\/ __  / / / / / _ \\    \\__ \\/ __/ __ \\/ ___/ __/ _ \\/ ___/
     / _, _/  __/ /_/ / /__/ /_   / /|  / /_/ / /_/ /  __/  / /  / / /_/ / /_/ / /_/ / /  __/   ___/ / /_/ /_/ / /  / /_/  __/ /
    /_/ |_|\\___/\\__,_/\\___/\\__/  /_/ |_/\\____/\\__,_/\\___/  /_/  /_/\\____/\\__,_/\\__,_/_/\\___/   /____/\\__/\\__,_/_/   \\__/\\___/_/
________________________________________________________________________________________________________________________________________
`
)

const env = process.env.NODE_ENV

dotenv.config( { path: [
	`.env.${ env }.local`,
	`.env.${ env }`,
	'.env.local',
	'.env'
] } )


/**
 * Initial file generated with `npx ts-jest config:init`
 * 
 */
const config: JestConfigWithTsJest = {
	/**
	 * Use JSDOM by default since react testing library requires JSDOM environment.
	 * 
	 * Use `@jest-environment node` directive at the top of your testing file if testing simple functions.
	 * 
	 * https://jestjs.io/docs/configuration#testenvironment-string
	 */
	testEnvironment: 'jest-environment-jsdom',
	moduleDirectories: [ 'node_modules', '<rootDir>/' ],
	testMatch: [ '**/__tests__/**/*.(test|spec).(ts|tsx)' ],
	/**
	 * If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
	 * you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
	 * The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
	 */
	moduleNameMapper: {
		'@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+.tsx?$': [ 'ts-jest', {} ],
	},
}

export default config