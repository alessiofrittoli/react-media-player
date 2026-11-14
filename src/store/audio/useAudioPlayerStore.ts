import { AudioPlayerContext } from '@/store/audio/AudioPlayerContext'
import type { UseMediaPlayer } from '@/hooks/useMediaPlayer'
import type { Queue } from '@/types'
import { useContext } from 'react'

export const useAudioPlayerStore = <T extends Queue = Queue>(): UseMediaPlayer<T> => {
	const result = useContext(AudioPlayerContext)

	if (!result) {
		throw new Error(
			'useAudioPlayerStore has been called outside AudioPlayer Context Provider. ' +
				'Please make sure to wrap your components with the AudioPlayer Component.',
		)
	}

	return result as unknown as UseMediaPlayer<T>
}
