import { VideoPlayerProvider } from '@/store/video/VideoPlayerProvider'
import { VolumeProvider } from '@/store/volume/VolumeProvider'
import { HTMLVideoPlayer, HTMLVideoPlayerProps } from '@/components/video/HTMLVideoPlayer'
import type { UseVideoPlayerOptions } from '@/hooks/useVideoPlayer'


export interface VideoPlayerProps extends React.PropsWithChildren<UseVideoPlayerOptions>
{
	htmlProps?: HTMLVideoPlayerProps
}


/**
 * The official VideoPlayer.
 * 
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ( { children, htmlProps, ...options } ) => (
	<VideoPlayerProvider { ...options }>
		<VolumeProvider volume={ options.volume }>
			<HTMLVideoPlayer { ...htmlProps } />
			{ children }
		</VolumeProvider>
	</VideoPlayerProvider>
)