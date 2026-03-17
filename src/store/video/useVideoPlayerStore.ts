import { useContext } from 'react'
import type { Queue } from '@/types'
import type { UseVideoPlayer } from '@/hooks/useVideoPlayer'
import { VideoPlayerContext } from '@/store/video/VideoPlayerContext'

export const useVideoPlayerStore = <T extends Queue = Queue>(): UseVideoPlayer<T> => {

	const result = useContext( VideoPlayerContext )

	if ( ! result ) {
		throw new Error(
			'useVideoPlayerStore has been called outside VideoPlayer Context Provider. ' +
			'Please make sure to wrap your components with the VideoPlayer Component.'
		)
	}

	return result as unknown as UseVideoPlayer<T>
	
}