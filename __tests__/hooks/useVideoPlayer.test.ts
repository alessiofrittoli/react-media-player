import { useMediaPlayer as _useMediaPlayer } from '@/hooks/useMediaPlayer'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { renderHook } from '@testing-library/react'
import { useRef as _useRef } from 'react'
import type { Queue } from '@/types'

vi.mock('react', async importActual => ({
	...(await importActual()),
	useRef: vi.fn(value => ({ current: value })),
}))

vi.mock('@/hooks/useMediaPlayer', () => ({
	useMediaPlayer: vi.fn(),
}))

const useRef = _useRef as Mock<typeof _useRef>
const useMediaPlayer = _useMediaPlayer as Mock<typeof _useMediaPlayer>

describe('useVideoPlayer', () => {
	it('passes undefined media until the ref is set', () => {
		const options = { queue: { items: [] } as Queue }
		const { result } = renderHook(() => useVideoPlayer(options))

		expect(result.current.videoRef.current).toBeNull()
		expect(useMediaPlayer).toHaveBeenCalledTimes(1)
		expect(useMediaPlayer).toHaveBeenCalledWith({ media: undefined, ...options })
	})

	it('sets media when the ref becomes available', async () => {
		useRef.mockReturnValueOnce({ current: document.createElement('video') })

		const options = { queue: { items: [] } as Queue }

		const { result } = renderHook(() => useVideoPlayer(options))

		expect(result.current.videoRef.current).toBeInstanceOf(HTMLVideoElement)
	})
})
