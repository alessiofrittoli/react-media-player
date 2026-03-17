'use client'

import { useVideoPlayer, type UseVideoPlayerOptions } from '@/hooks/useVideoPlayer'
import { VideoPlayerContext } from '@/store/video/VideoPlayerContext'


export type VideoPlayerProviderProps = React.PropsWithChildren<UseVideoPlayerOptions>


export const VideoPlayerProvider: React.FC<VideoPlayerProviderProps> = ( { children, ...options } ) => (
	<VideoPlayerContext.Provider value={ useVideoPlayer( options ) }>
		{ children }
	</VideoPlayerContext.Provider>
)