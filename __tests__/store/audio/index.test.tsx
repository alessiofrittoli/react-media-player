import { useAudioPlayerStore } from '@/store/audio/useAudioPlayerStore'
import { AudioPlayerProvider } from '@/store/audio/AudioPlayerProvider'
import { AudioPlayerContext } from '@/store/audio/AudioPlayerContext'
import { render, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Media, Queue } from '@/types'
import { addItemsUUID } from '@/utils'

const queue: Queue = {
	items: addItemsUUID<Media>([{ src: '/audio.mp3', type: 'audio', title: 'Test audio' }]),
}

describe('Audio player store', () => {
	it('exposes a stable display name for the context', () => {
		expect(AudioPlayerContext.displayName).toBe('AudioPlayerContext')
	})

	it('throws when used outside the provider', () => {
		expect(() => renderHook(() => useAudioPlayerStore())).toThrow(
			'useAudioPlayerStore has been called outside AudioPlayer Context Provider. ' +
				'Please make sure to wrap your components with the AudioPlayer Component.',
		)
	})

	it('provides a store from the provider', () => {
		const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
			<AudioPlayerProvider queue={queue}>{children}</AudioPlayerProvider>
		)

		const { result } = renderHook(() => useAudioPlayerStore(), { wrapper })

		expect(result.current.media).toBeDefined()
		expect(result.current.initialVolume).toBe(1)
	})

	it('respects initial volume from provider prop', () => {
		render(
			<AudioPlayerProvider queue={queue} volume={0.7}>
				<AudioPlayerContext.Consumer>
					{value => <span>{value?.initialVolume}</span>}
				</AudioPlayerContext.Consumer>
			</AudioPlayerProvider>,
		)

		expect(document.body.textContent).toBe('0.7')
	})
})
