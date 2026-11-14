import {
	useEventListener as _useEventListener,
	type CustomEventListenerOptions,
} from '@alessiofrittoli/react-hooks'
import { updatePositionState as _updatePositionState } from '@alessiofrittoli/media-utils'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useMediaSession } from '@/hooks/useMediaSession'
import { renderHook, act } from '@testing-library/react'

vi.mock('@alessiofrittoli/react-hooks', async importActual => ({
	...(await importActual()),
	useEventListener: vi.fn(),
}))

vi.mock('@alessiofrittoli/media-utils', () => ({
	updatePositionState: vi.fn(),
}))

const useEventListener = _useEventListener as unknown as Mock<typeof _useEventListener>
const updatePositionState = _updatePositionState as unknown as Mock<typeof _updatePositionState>

type MockHTMLMediaElement = HTMLMediaElement & {
	duration: number
	currentTime: number
	fastSeek?: Mock
}

describe('useMediaSession', () => {
	let originalMediaSession: MediaSession
	let actionHandlers: Record<string, MediaSessionActionHandler | null | undefined>
	let setActionHandler: Mock
	let warnSpy: Mock<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(message?: any, ...optionalParams: any[]): void
	}>

	beforeEach(() => {
		originalMediaSession = navigator.mediaSession

		actionHandlers = {}

		setActionHandler = vi.fn((action, handler) => {
			actionHandlers[action] = handler ?? null
		})

		Object.defineProperty(navigator, 'mediaSession', {
			configurable: true,
			writable: true,
			value: {
				playbackState: undefined,
				setActionHandler,
				setPositionState: vi.fn(),
				metadata: undefined,
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

	const getUseEventListenerCall = (
		index: number,
	): [
		type: string | string[],
		options: CustomEventListenerOptions<Record<string, Event>, string, Event>,
	] => {
		const call = useEventListener.mock.calls.at(index)
		if (!call) throw new Error('useEventListener was not called')
		return call
	}

	const getPlayPauseListener = (): ((event: Event) => void) => {
		const call = getUseEventListenerCall(0)
		return call[1].listener as (event: Event) => void
	}

	const getLoadedMetadataListener = (): (() => void) => {
		const call = getUseEventListenerCall(1)
		return call[1].listener as () => void
	}

	it('updates playback state on play and pause events', () => {
		const media = {
			duration: 100,
			currentTime: 0,
		} as MockHTMLMediaElement

		renderHook(() => useMediaSession({ media, register: false }))

		expect(useEventListener).toHaveBeenCalledTimes(2)
		expect(getUseEventListenerCall(0)[0]).toEqual(['play', 'pause'])
		expect(getUseEventListenerCall(0)[1].target).toBe(media)

		const listener = getPlayPauseListener()

		act(() => {
			listener({ type: 'play' } as Event)
		})

		expect(navigator.mediaSession.playbackState).toBe('playing')

		act(() => {
			listener({ type: 'pause' } as Event)
		})

		expect(navigator.mediaSession.playbackState).toBe('paused')
	})

	it('registers play, pause, and stop handlers when register is set to true', () => {
		const media = {
			duration: 100,
			currentTime: 0,
		} as MockHTMLMediaElement

		const onPlay = vi.fn()
		const onPause = vi.fn()
		const onStop = vi.fn()

		const { rerender } = renderHook(
			({ register }) => useMediaSession({ media, register, onPlay, onPause, onStop }),
			{
				initialProps: { register: false },
			},
		)

		expect(setActionHandler).not.toHaveBeenCalled()

		rerender({ register: true })

		expect(setActionHandler).toHaveBeenCalledWith('play', onPlay)
		expect(setActionHandler).toHaveBeenCalledWith('pause', onPause)
		expect(setActionHandler).toHaveBeenCalledWith('stop', onStop)
	})

	it('warns when the stop action is unsupported', () => {
		const media = {
			duration: 100,
			currentTime: 0,
		} as MockHTMLMediaElement

		setActionHandler.mockImplementation((action, handler) => {
			if (action === 'stop') throw new Error('unsupported')
			actionHandlers[action] = handler ?? null
		})

		const { rerender } = renderHook(
			({ register }) => useMediaSession({ media, register, onStop: vi.fn() }),
			{
				initialProps: { register: false },
			},
		)

		rerender({ register: true })

		expect(warnSpy).toHaveBeenCalledWith(
			'Warning! The "stop" media session action is not supported.',
			expect.any(Error),
		)
	})

	it('does nothing when no media is available', () => {
		renderHook(() => useMediaSession({ register: true }))

		const listener = getLoadedMetadataListener()

		act(() => {
			listener()
		})

		expect(setActionHandler).not.toHaveBeenCalled()
	})

	it('disables seek actions for live media and handles unsupported seekto', () => {
		const media = {
			duration: Infinity,
			currentTime: 0,
		} as MockHTMLMediaElement

		setActionHandler.mockImplementation((action, handler) => {
			if (action === 'seekto') throw new Error('unsupported')
			actionHandlers[action] = handler ?? null
		})

		renderHook(() => useMediaSession({ media, register: true }))

		const listener = getLoadedMetadataListener()

		act(() => {
			listener()
		})

		expect(setActionHandler).toHaveBeenCalledWith('seekbackward', null)
		expect(setActionHandler).toHaveBeenCalledWith('seekforward', null)

		expect(warnSpy).toHaveBeenCalledWith(
			"Couldn't de-register 'seekto' MediaSession action handler since it is not supported by the current browser.",
			expect.any(Error),
		)
	})

	it('handles seek handlers, default offsets, and fast seek', () => {
		const media = {
			duration: 50,
			currentTime: 25,
			fastSeek: vi.fn(),
		} as MockHTMLMediaElement

		const onSeekBackward = vi.fn()
		const onSeekForward = vi.fn()
		const onSeekTo = vi.fn()

		renderHook(() =>
			useMediaSession({
				media,
				register: true,
				onSeekBackward,
				onSeekForward,
				onSeekTo,
			}),
		)

		const listener = getLoadedMetadataListener()

		act(() => {
			listener()
		})

		const seekBackward = actionHandlers.seekbackward
		const seekForward = actionHandlers.seekforward
		const seekTo = actionHandlers.seekto

		act(() => {
			seekBackward?.({ seekOffset: 5 } as MediaSessionActionDetails)
		})

		expect(media.currentTime).toBe(20)
		expect(updatePositionState).toHaveBeenCalledWith(media)
		expect(onSeekBackward).toHaveBeenCalledWith({ seekOffset: 5 })

		media.currentTime = 5
		updatePositionState.mockClear()

		act(() => {
			seekBackward?.({} as MediaSessionActionDetails)
		})

		expect(media.currentTime).toBe(0)
		expect(updatePositionState).toHaveBeenCalledWith(media)

		media.currentTime = 45
		updatePositionState.mockClear()

		act(() => {
			seekForward?.({} as MediaSessionActionDetails)
		})

		expect(media.currentTime).toBe(50)
		expect(updatePositionState).toHaveBeenCalledWith(media)
		expect(onSeekForward).toHaveBeenCalled()

		updatePositionState.mockClear()

		act(() => {
			seekTo?.({ seekTime: undefined } as MediaSessionActionDetails)
		})

		expect(updatePositionState).not.toHaveBeenCalled()

		act(() => {
			seekTo?.({ seekTime: 30, fastSeek: true } as MediaSessionActionDetails)
		})

		expect(media.fastSeek).toHaveBeenCalledWith(30)
		expect(updatePositionState).toHaveBeenCalledWith(media)
		expect(onSeekTo).toHaveBeenCalledWith({ seekTime: 30, fastSeek: true })

		updatePositionState.mockClear()

		act(() => {
			seekTo?.({ seekTime: 40 } as MediaSessionActionDetails)
		})

		expect(media.currentTime).toBe(40)
		expect(updatePositionState).toHaveBeenCalledWith(media)
		expect(onSeekTo).toHaveBeenCalledWith({ seekTime: 40 })
	})

	it('warns when seekto action is unsupported', () => {
		const media = {
			duration: 100,
			currentTime: 10,
		} as MockHTMLMediaElement

		setActionHandler.mockImplementation((action, handler) => {
			if (action === 'seekto') throw new Error('unsupported')
			actionHandlers[action] = handler ?? null
		})

		renderHook(() => useMediaSession({ media, register: true }))

		const listener = getLoadedMetadataListener()

		act(() => {
			listener()
		})

		expect(warnSpy).toHaveBeenCalledWith(
			'Warning! The "seekto" media session action is not supported.',
			expect.any(Error),
		)
	})

	it('registers previous and next track handlers when enabled', () => {
		const media = {
			duration: 100,
			currentTime: 10,
		} as MockHTMLMediaElement

		const onPrev = vi.fn()
		const onNext = vi.fn()

		const { rerender } = renderHook(
			({ register }) => useMediaSession({ media, register, onPrev, onNext }),
			{
				initialProps: { register: false },
			},
		)

		expect(setActionHandler).not.toHaveBeenCalledWith('previoustrack', onPrev)
		expect(setActionHandler).not.toHaveBeenCalledWith('nexttrack', onNext)

		rerender({ register: true })

		expect(setActionHandler).toHaveBeenCalledWith('previoustrack', onPrev)
		expect(setActionHandler).toHaveBeenCalledWith('nexttrack', onNext)
	})
})
