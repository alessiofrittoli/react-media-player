import {
	useEventListener as _useEventListener,
	type CustomEventListenerOptions,
} from '@alessiofrittoli/react-hooks'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useMediaPlayerLoading } from '@/hooks/useMediaPlayerLoading'
import { renderHook, act } from '@testing-library/react'

vi.mock('@alessiofrittoli/react-hooks', async importActual => ({
	...(await importActual()),
	useEventListener: vi.fn(),
}))

const useEventListener = _useEventListener as unknown as Mock<typeof _useEventListener>

type Listener = (event: Event) => void

type MockHTMLMediaElement = HTMLMediaElement & {
	error?: MediaError | null
}

describe('useMediaPlayerLoading', () => {
	let mockMedia: MockHTMLMediaElement

	beforeEach(() => {
		mockMedia = {
			error: undefined,
		} as MockHTMLMediaElement

		vi.clearAllMocks()
	})

	const getUseEventListenerFirstCall = (): [
		type: string | string[],
		options: CustomEventListenerOptions<Record<string, Event>, string, Event>,
	] => {
		const call = useEventListener.mock.calls.at(0)
		if (!call) throw new Error('useEventListener was not called')
		return call
	}

	const getEventsMap = (): (keyof HTMLElementEventMap)[] => {
		const call = getUseEventListenerFirstCall()
		return call[0] as (keyof HTMLElementEventMap)[]
	}

	const getListener = (): Listener => {
		const call = getUseEventListenerFirstCall()
		return call[1].listener as Listener
	}

	it('initializes and registers event listeners', () => {
		const { result } = renderHook(() => useMediaPlayerLoading({ media: mockMedia }))

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeUndefined()

		expect(useEventListener).toHaveBeenCalledTimes(1)
		expect(getEventsMap()).toEqual(['waiting', 'playing', 'loadstart', 'loadeddata', 'error'])

		expect(getUseEventListenerFirstCall()[1].target).toBe(mockMedia)
	})

	it('sets loading state on loadstart and waiting', () => {
		const { result } = renderHook(() => useMediaPlayerLoading({ media: mockMedia }))

		const listener = getListener()

		const mediaError = { code: 1 } as MediaError
		mockMedia.error = mediaError

		act(() => {
			listener({ type: 'error' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBe(mediaError)

		act(() => {
			listener({ type: 'loadstart' } as Event)
		})

		expect(result.current.isLoading).toBe(true)
		expect(result.current.error).toBeUndefined()

		act(() => {
			listener({ type: 'waiting' } as Event)
		})

		expect(result.current.isLoading).toBe(true)
		expect(result.current.error).toBeUndefined()
	})

	it('clears loading state on loadeddata and playing', () => {
		const { result } = renderHook(() => useMediaPlayerLoading({ media: mockMedia }))

		const listener = getListener()

		act(() => {
			listener({ type: 'loadstart' } as Event)
		})

		expect(result.current.isLoading).toBe(true)

		act(() => {
			listener({ type: 'loadeddata' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeUndefined()

		act(() => {
			listener({ type: 'waiting' } as Event)
		})

		expect(result.current.isLoading).toBe(true)

		act(() => {
			listener({ type: 'playing' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeUndefined()
	})

	it('handles error events with and without media error', () => {
		const { result } = renderHook(() => useMediaPlayerLoading({ media: mockMedia }))

		const listener = getListener()

		act(() => {
			listener({ type: 'waiting' } as Event)
		})

		expect(result.current.isLoading).toBe(true)

		mockMedia.error = null

		act(() => {
			listener({ type: 'error' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeUndefined()

		const mediaError = { code: 4 } as MediaError
		mockMedia.error = mediaError
		act(() => {
			listener({ type: 'error' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBe(mediaError)
	})

	it('does nothing when media is missing', () => {
		const { result } = renderHook(() => useMediaPlayerLoading({}))

		const listener = getListener()

		act(() => {
			listener({ type: 'loadstart' } as Event)
		})

		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeUndefined()
	})
})
