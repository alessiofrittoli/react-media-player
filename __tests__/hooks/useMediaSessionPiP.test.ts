import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useMediaSessionPiP } from '@/hooks/useMediaSessionPiP'
import { renderHook } from '@testing-library/react'

describe('useMediaSessionPiP', () => {
	let originalMediaSession: MediaSession
	let setActionHandler: Mock
	let warnSpy: Mock

	beforeEach(() => {
		originalMediaSession = navigator.mediaSession

		setActionHandler = vi.fn()

		Object.defineProperty(navigator, 'mediaSession', {
			configurable: true,
			writable: true,
			value: {
				setActionHandler,
			},
		})

		warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
	})

	afterEach(() => {
		Object.defineProperty(navigator, 'mediaSession', {
			configurable: true,
			writable: true,
			value: originalMediaSession,
		})

		warnSpy.mockRestore()
		vi.clearAllMocks()
	})

	it('does nothing when register is false', () => {
		const onEnterPiP = vi.fn()

		renderHook(() => useMediaSessionPiP({ register: false, onEnterPiP }))

		expect(setActionHandler).not.toHaveBeenCalled()
	})

	it('registers the enterpictureinpicture handler when enabled', () => {
		const onEnterPiP = vi.fn()

		renderHook(() => useMediaSessionPiP({ register: true, onEnterPiP }))

		expect(setActionHandler).toHaveBeenCalledWith('enterpictureinpicture', onEnterPiP)
	})

	it('warns when enterpictureinpicture action is unsupported', () => {
		setActionHandler.mockImplementation(() => {
			throw new Error('unsupported')
		})

		const onEnterPiP = vi.fn()

		renderHook(() => useMediaSessionPiP({ register: true, onEnterPiP }))

		expect(warnSpy).toHaveBeenCalledWith(
			'Warning! The "enterpictureinpicture" media session action is not supported.',
			expect.any(Error),
		)
	})
})
