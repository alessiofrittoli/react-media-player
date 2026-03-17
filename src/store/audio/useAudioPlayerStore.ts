import { useContext } from 'react'
import type { Queue } from '@/types'
import type { UseMediaPlayer } from '@/hooks/useMediaPlayer'
import { AudioPlayerContext } from '@/store/audio/AudioPlayerContext'


export const useAudioPlayerStore = <T extends Queue = Queue>(): UseMediaPlayer<T> => {

	const result = useContext( AudioPlayerContext )

	if ( ! result ) {
		throw new Error(
			'useAudioPlayerStore has been called outside AudioPlayer Context Provider. ' +
			'Please make sure to wrap your components with the AudioPlayer Component.'
		)
	}

	return result as unknown as UseMediaPlayer<T>
	
}