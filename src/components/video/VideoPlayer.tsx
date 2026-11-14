import { HTMLVideoPlayer, type HTMLVideoPlayerProps } from '@/components/video/HTMLVideoPlayer'
import { VideoPlayerProvider } from '@/store/video/VideoPlayerProvider'
import type { UseVideoPlayerOptions } from '@/hooks/useVideoPlayer'
import { VolumeProvider } from '@/store/volume/VolumeProvider'

export interface VideoPlayerProps extends React.PropsWithChildren<UseVideoPlayerOptions> {
	/**
	 * Props passed to the rendered `HTMLVideoElement`.
	 *
	 */
	htmlProps?: HTMLVideoPlayerProps
}

/**
 * The official VideoPlayer.
 *
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ children, htmlProps, ...options }) => (
	<VideoPlayerProvider {...options}>
		<VolumeProvider volume={options.volume}>
			<HTMLVideoPlayer {...htmlProps} />
			{children}
		</VolumeProvider>
	</VideoPlayerProvider>
)
