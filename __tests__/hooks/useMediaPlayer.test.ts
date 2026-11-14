import {
	PlayerState,
	type UseMediaPlayerController,
	useMediaPlayerController as _useMediaPlayerController,
} from '@/hooks/useMediaPlayerController'
import { useEventListener as _useEventListener, type EventListenerTarget } from '@alessiofrittoli/react-hooks'
import { type UseMediaPreload, useMediaPreload as _useMediaPreload } from '@/hooks/useMediaPreload'
import { useMediaPlayerLoading as _useMediaPlayerLoading } from '@/hooks/useMediaPlayerLoading'
import { useMediaSession as _useMediaSession } from '@/hooks/useMediaSession'
import { type UseVolume, useVolume as _useVolume } from '@/hooks/useVolume'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useMediaPlayer } from '@/hooks/useMediaPlayer'
import type { Queue } from '@/types'

vi.mock('@alessiofrittoli/react-hooks', async importActual => ({
	...(await importActual()),
	useEventListener: vi.fn(),
}))

vi.mock('@/hooks/useMediaSession', () => ({
	useMediaSession: vi.fn(),
}))

vi.mock('@/hooks/useVolume', () => ({
	useVolume: vi.fn(),
}))

vi.mock('@/hooks/useMediaPreload', () => ({
	useMediaPreload: vi.fn(),
}))

vi.mock('@/hooks/useMediaPlayerLoading', () => ({
	useMediaPlayerLoading: vi.fn(),
}))

vi.mock('@/hooks/useMediaPlayerController', async importActual => ({
	...(await importActual()),
	useMediaPlayerController: vi.fn(),
}))

const useEventListener = _useEventListener as unknown as Mock<typeof _useEventListener>
const useMediaSession = _useMediaSession as Mock<typeof _useMediaSession>
const useVolume = _useVolume as Mock<typeof _useVolume>
const useMediaPreload = _useMediaPreload as Mock<typeof _useMediaPreload>
const useMediaPlayerLoading = _useMediaPlayerLoading as Mock<typeof _useMediaPlayerLoading>
const useMediaPlayerController = _useMediaPlayerController as Mock<typeof _useMediaPlayerController>

type MockMediaElement = HTMLMediaElement & {
	duration: number
	currentTime: number
}

describe('useMediaPlayer', () => {
	let mockMedia: MockMediaElement
	let queue: Queue

	const volumeController = {
		volumeRef: { current: 0 },
		volume: 0,
		setVolume: vi.fn(),
	}

	const preloadController = {
		preloadMedia: vi.fn(),
		preloadPreviousMedia: vi.fn(),
		preloadNextMedia: vi.fn(),
	}

	const loadingController = {
		isLoading: false,
		error: undefined,
	}

	const controller = {
		state: PlayerState.PLAYING,
		hasNext: true,
		hasPrevious: true,
		togglePlayPause: vi.fn(),
		stop: vi.fn(),
		previous: vi.fn(),
		next: vi.fn(),
	}

	beforeEach(() => {
		mockMedia = {
			duration: 120,
			currentTime: 0,
		} as MockMediaElement

		queue = { items: [] } as unknown as Queue

		vi.clearAllMocks()

		useVolume.mockReturnValue(volumeController as unknown as UseVolume)
		useMediaPlayerController.mockReturnValue(controller as unknown as UseMediaPlayerController)
		useMediaPreload.mockReturnValue(preloadController as unknown as UseMediaPreload)
		useMediaPlayerLoading.mockReturnValue(loadingController)
	})

	const getListener = (event: string): (() => void) => {
		const call = useEventListener.mock.calls.find(([name]) => name === event)
		if (!call) throw new Error(`useEventListener was not called for ${event}`)
		return call[1].listener as () => void
	}

	const getTarget = (event: string): EventListenerTarget | React.RefObject<EventListenerTarget> => {
		const call = useEventListener.mock.calls.find(([name]) => name === event)
		if (!call) throw new Error(`useEventListener was not called for ${event}`)
		return call[1].target
	}

	it('wires controllers and registers media session', () => {
		const options = {
			queue,
			media: mockMedia,
			volume: 0.7,
			normalizeVolume: true,
			playPauseFadeDuration: 150,
			preload: true,
		}

		const { result } = renderHook(() => useMediaPlayer(options))

		expect(useVolume).toHaveBeenCalledWith({
			media: mockMedia,
			volume: 0.7,
			fade: 150,
			normalizeVolume: true,
		})

		expect(useMediaPlayerController).toHaveBeenCalledWith({
			...options,
			volumeRef: volumeController.volumeRef,
		})

		expect(useMediaSession).toHaveBeenCalledWith({
			media: mockMedia,
			register: true,
			onPlay: controller.togglePlayPause,
			onPause: controller.togglePlayPause,
			onStop: controller.stop,
			onPrev: controller.previous,
			onNext: controller.next,
		})

		expect(useEventListener).toHaveBeenCalledTimes(2)
		expect(getTarget('canplaythrough')).toBe(mockMedia)
		expect(getTarget('timeupdate')).toBe(mockMedia)

		expect(result.current.media).toBe(mockMedia)
		expect(result.current.state).toBe(controller.state)
		expect(result.current.hasNext).toBe(controller.hasNext)
		expect(result.current.hasPrevious).toBe(controller.hasPrevious)
		expect(result.current.togglePlayPause).toBe(controller.togglePlayPause)
		expect(result.current.stop).toBe(controller.stop)
		expect(result.current.previous).toBe(controller.previous)
		expect(result.current.next).toBe(controller.next)

		expect(result.current.volumeRef).toBe(volumeController.volumeRef)
		expect(result.current.setVolume).toBe(volumeController.setVolume)

		expect(result.current.preloadMedia).toBe(preloadController.preloadMedia)
		expect(result.current.preloadPreviousMedia).toBe(preloadController.preloadPreviousMedia)
		expect(result.current.preloadNextMedia).toBe(preloadController.preloadNextMedia)

		expect(result.current.isLoading).toBe(loadingController.isLoading)
		expect(result.current.error).toBe(loadingController.error)
	})

	it('preloads on canplaythrough and timeupdate when close to end', () => {
		renderHook(() => useMediaPlayer({ queue, media: mockMedia, preload: true }))

		const canPlayListener = getListener('canplaythrough')
		const timeUpdateListener = getListener('timeupdate')

		act(() => {
			canPlayListener()
		})

		expect(preloadController.preloadNextMedia).toHaveBeenCalledTimes(1)

		mockMedia.currentTime = 95
		act(() => {
			timeUpdateListener()
		})

		expect(preloadController.preloadNextMedia).toHaveBeenCalledTimes(2)

		mockMedia.currentTime = 70
		act(() => {
			timeUpdateListener()
		})

		expect(preloadController.preloadNextMedia).toHaveBeenCalledTimes(2)
	})

	it('skips preloading when preload is disabled', () => {
		renderHook(() => useMediaPlayer({ queue, media: mockMedia, preload: false }))

		expect(getTarget('canplaythrough')).toBeUndefined()
		expect(getTarget('timeupdate')).toBeUndefined()

		act(() => {
			getListener('canplaythrough')()
			getListener('timeupdate')()
		})

		expect(preloadController.preloadNextMedia).not.toHaveBeenCalled()
	})

	it('skips preloading when media is missing', () => {
		renderHook(() => useMediaPlayer({ queue, preload: true }))

		act(() => {
			getListener('canplaythrough')()
			getListener('timeupdate')()
		})

		expect(preloadController.preloadNextMedia).not.toHaveBeenCalled()
	})

	it('skips preloading when there is no next media and unregisters media session', () => {
		useMediaPlayerController.mockReturnValue({
			...controller,
			state: PlayerState.STOPPED,
			hasNext: false,
			hasPrevious: false,
		} as unknown as UseMediaPlayerController)

		renderHook(() => useMediaPlayer({ queue, media: mockMedia }))

		act(() => {
			getListener('canplaythrough')()
			getListener('timeupdate')()
		})

		expect(preloadController.preloadNextMedia).not.toHaveBeenCalled()

		expect(useMediaSession).toHaveBeenCalledWith({
			media: mockMedia,
			register: false,
			onPlay: controller.togglePlayPause,
			onPause: controller.togglePlayPause,
			onStop: controller.stop,
			onPrev: undefined,
			onNext: undefined,
		})
	})
})
