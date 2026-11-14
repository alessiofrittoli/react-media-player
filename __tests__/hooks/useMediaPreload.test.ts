import { getPreloadStrategy as _getPreloadStrategy } from '@alessiofrittoli/media-utils'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { UseMediaPlayerController } from '@/hooks/useMediaPlayerController'
import { useMediaPreload } from '@/hooks/useMediaPreload'
import { act, renderHook } from '@testing-library/react'
import type { Media } from '@/types'

vi.mock('@alessiofrittoli/media-utils', () => ({
	getPreloadStrategy: vi.fn(),
}))

const getPreloadStrategy = _getPreloadStrategy as Mock<typeof _getPreloadStrategy>

type MockPlayerController = Omit<UseMediaPlayerController, 'getPrevious' | 'getNext'> & {
	getPrevious: Mock
	getNext: Mock
}

const makeMedia = (type: Media['type'], src: string): Media =>
	({
		title: 'Test',
		type,
		src,
	}) as Media

type MockMediaElement = HTMLMediaElement & {
	preload: string
	muted: boolean
	src: string
	load: Mock
}

const makeMediaElement = (): MockMediaElement =>
	({
		preload: '',
		muted: false,
		src: '',
		load: vi.fn(),
	}) as MockMediaElement

describe('useMediaPreload', () => {
	let originalCreateElement: typeof document.createElement
	let createElementSpy: Mock<{
		<K extends keyof HTMLElementTagNameMap>(
			tagName: K,
			options?: ElementCreationOptions,
		): HTMLElementTagNameMap[K]
		<K extends keyof HTMLElementDeprecatedTagNameMap>(
			tagName: K,
			options?: ElementCreationOptions,
		): HTMLElementDeprecatedTagNameMap[K]
		(tagName: string, options?: ElementCreationOptions): HTMLElement
	}>

	let audioElement: MockMediaElement
	let videoElement: MockMediaElement
	let controller: MockPlayerController

	beforeEach(() => {
		originalCreateElement = document.createElement

		audioElement = makeMediaElement()
		videoElement = makeMediaElement()

		vi.stubGlobal(
			'Audio',
			vi.fn(
				class {
					public constructor() {
						return audioElement
					}
				},
			),
		)

		createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(tagName => {
			if (tagName === 'video') return videoElement
			return originalCreateElement.call(document, tagName)
		})

		controller = {
			getPrevious: vi.fn(),
			getNext: vi.fn(),
		} as MockPlayerController

		getPreloadStrategy.mockReturnValue('metadata')
	})

	afterEach(() => {
		createElementSpy.mockRestore()
		vi.clearAllMocks()
	})

	it('supports audio element preloads', () => {
		const { result } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/song.mp3'))
		})

		expect(global.Audio).toHaveBeenCalled()
		expect(audioElement.muted).toBe(true)
		expect(audioElement.src).toBe('/song.mp3')
		expect(audioElement.load).toHaveBeenCalledTimes(1)
	})

	it('supports video element preloads', () => {
		const { result } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			result.current.preloadMedia(makeMedia('video', '/movie.mp4'))
		})

		expect(document.createElement).toHaveBeenCalledWith('video')
		expect(videoElement.muted).toBe(true)
		expect(videoElement.src).toBe('/movie.mp4')
		expect(videoElement.load).toHaveBeenCalledTimes(1)
	})

	it('preloads media with LRU eviction', () => {
		const { result } = renderHook(() =>
			useMediaPreload({
				controller,
				cacheEntries: 1,
				checkConnection: true,
			}),
		)

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/a.mp3'))
		})

		expect(getPreloadStrategy).toHaveBeenCalledTimes(1)
		expect(audioElement.preload).toBe('metadata')
		expect(audioElement.muted).toBe(true)
		expect(audioElement.src).toBe('/a.mp3')
		expect(audioElement.load).toHaveBeenCalledTimes(1)
		expect(global.Audio).toHaveBeenCalledTimes(1)

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/b.mp3'))
		})

		expect(audioElement.src).toBe('/b.mp3')
		expect(audioElement.load).toHaveBeenCalledTimes(2)

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/a.mp3'))
		})

		expect(audioElement.load).toHaveBeenCalledTimes(3) // .load() get called again since we set `cacheEntries: 1`
	})

	it('skips already preloaded media', () => {
		const { result } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/same.mp3'))
		})

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/same.mp3'))
		})

		expect(audioElement.load).toHaveBeenCalledTimes(1)
	})

	it('skips when media element already has the same src', () => {
		const { result } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/cached.mp3'))
		})

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/cached.mp3'))
		})

		expect(audioElement.load).toHaveBeenCalledTimes(1)
	})

	it('always preload new media when cacheEntries has been set to 0', () => {
		const { result } = renderHook(() => useMediaPreload({ controller, cacheEntries: 0 }))

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/song-1.mp3'))
		})

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/song-2.mp3'))
		})

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/song-3.mp3'))
		})

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/song-3.mp3')) // event if `cacheEntries: 0` duplicates are not preloaded again
		})

		expect(audioElement.load).toHaveBeenCalledTimes(3)
	})

	it('preloads media with strategy depending on connection quality', () => {
		const { result } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			getPreloadStrategy.mockReturnValue('auto')
			result.current.preloadMedia(makeMedia('audio', '/song.mp3'))
		})

		expect(audioElement.preload).toBe('auto')

		act(() => {
			getPreloadStrategy.mockReturnValue('none')
			result.current.preloadMedia(makeMedia('audio', '/song-2.mp3'))
		})

		expect(audioElement.preload).toBe('none')
	})

	it('preloads media with auto strategy when checkConnection is false', () => {
		const { result } = renderHook(() =>
			useMediaPreload({
				controller,
				checkConnection: false,
			}),
		)

		act(() => {
			result.current.preloadMedia(makeMedia('video', '/movie.mp4'))
		})

		expect(videoElement.preload).toBe('auto')
		expect(videoElement.load).toHaveBeenCalledTimes(1)
	})

	it('cleans up preloaded elements on unmount', () => {
		const { result, unmount } = renderHook(() => useMediaPreload({ controller }))

		act(() => {
			result.current.preloadMedia(makeMedia('audio', '/a.mp3'))
			result.current.preloadMedia(makeMedia('video', '/v.mp4'))
		})

		unmount()

		expect(audioElement.src).toBe('')
		expect(videoElement.src).toBe('')
		expect(audioElement.load).toHaveBeenCalled()
		expect(videoElement.load).toHaveBeenCalled()
	})

	describe('preloadPreviousMedia', () => {
		it('preloads previous media', () => {
			controller.getPrevious.mockReturnValue(makeMedia('audio', '/prev.mp3'))

			const { result } = renderHook(() => useMediaPreload({ controller }))

			act(() => {
				result.current.preloadPreviousMedia()
			})

			expect(audioElement.load).toHaveBeenCalledTimes(1)
		})

		it('does nothing if no previous media has been found', () => {
			controller.getPrevious.mockReturnValue(undefined)

			const { result } = renderHook(() => useMediaPreload({ controller }))

			act(() => {
				result.current.preloadPreviousMedia()
			})

			expect(audioElement.load).not.toHaveBeenCalled()
		})

		it('allows connection checks overrides', () => {
			controller.getPrevious.mockReturnValue(makeMedia('audio', '/prev.mp3'))

			const { result } = renderHook(() => useMediaPreload({ controller, checkConnection: false }))

			act(() => {
				result.current.preloadPreviousMedia()
			})

			expect(audioElement.preload).toBe('auto')

			controller.getPrevious.mockReturnValue(makeMedia('audio', '/prev-2.mp3'))

			act(() => {
				result.current.preloadPreviousMedia(true)
			})

			expect(audioElement.preload).toBe('metadata')
		})
	})

	describe('preloadNextMedia', () => {
		it('preloads next media', () => {
			controller.getNext.mockReturnValue(makeMedia('audio', '/next.mp3'))

			const { result } = renderHook(() => useMediaPreload({ controller }))

			act(() => {
				result.current.preloadNextMedia()
			})

			expect(audioElement.load).toHaveBeenCalledTimes(1)
		})

		it('does nothing if no next media has been found', () => {
			controller.getNext.mockReturnValue(undefined)

			const { result } = renderHook(() => useMediaPreload({ controller }))

			act(() => {
				result.current.preloadNextMedia()
			})

			expect(audioElement.load).not.toHaveBeenCalled()
		})

		it('allows connection checks overrides', () => {
			controller.getNext.mockReturnValue(makeMedia('audio', '/next.mp3'))

			const { result } = renderHook(() => useMediaPreload({ controller, checkConnection: false }))

			act(() => {
				result.current.preloadNextMedia()
			})

			expect(audioElement.preload).toBe('auto')

			controller.getNext.mockReturnValue(makeMedia('audio', '/next-2.mp3'))

			act(() => {
				result.current.preloadNextMedia(true)
			})

			expect(audioElement.preload).toBe('metadata')
		})
	})
})
