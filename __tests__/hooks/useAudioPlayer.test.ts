/**
 * @vitest-environment node
 */
import { useMediaPlayer as _useMediaPlayer, type UseMediaPlayer } from '@/hooks/useMediaPlayer'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useRef as _useRef } from 'react'
import type { Queue } from '@/types'

vi.mock('react', () => ({
	useRef: vi.fn(),
}))

vi.mock('@/hooks/useMediaPlayer', () => ({
	useMediaPlayer: vi.fn(),
}))

const useRef = _useRef as Mock<typeof _useRef>
const useMediaPlayer = _useMediaPlayer as Mock<typeof _useMediaPlayer>

describe('useAudioPlayer', () => {
	it('uses Audio when window is available', () => {
		class MockAudio {}

		vi.stubGlobal('Audio', MockAudio)

		Object.defineProperty(global, 'window', {
			configurable: true,
			value: {},
		})

		const refCurrent = { tag: 'ref' }
		useRef.mockReturnValue({ current: refCurrent })

		const options = { queue: { items: [] } as Queue }
		const player = { tag: 'player' } as unknown as UseMediaPlayer

		useMediaPlayer.mockReturnValue(player)

		const result = useAudioPlayer(options)

		expect(useRef).toHaveBeenCalledTimes(1)
		expect(useRef.mock.calls[0]?.[0]).toBeInstanceOf(MockAudio)
		expect(useMediaPlayer).toHaveBeenCalledWith({ media: refCurrent, ...options })
		expect(result).toBe(player)

		Object.defineProperty(global, 'window', {
			configurable: true,
			value: undefined,
		})
	})

	it('uses undefined media when window is not available', () => {
		Object.defineProperty(global, 'window', {
			configurable: true,
			value: undefined,
		})

		const refCurrent = { tag: 'ref' }
		useRef.mockReturnValue({ current: refCurrent })

		const options = { queue: { items: [] } as Queue }
		const player = { tag: 'player' } as unknown as UseMediaPlayer
		useMediaPlayer.mockReturnValue(player)

		useAudioPlayer(options)

		expect(useRef).toHaveBeenCalledTimes(1)
		expect(useRef.mock.calls[0]?.[0]).toBeUndefined()
		expect(useMediaPlayer).toHaveBeenCalledWith({ media: refCurrent, ...options })
	})
})
