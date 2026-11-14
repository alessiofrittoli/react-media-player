import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

/**
 * Unmounts React trees mounted with `render()` after each test.
 *
 * @see https://testing-library.com/docs/react-testing-library/api#cleanup
 */
afterEach(() => cleanup())
