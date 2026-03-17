'use client'

import { useVideoPlayerStore } from '@/store/video/useVideoPlayerStore'

export type HTMLVideoPlayerProps = Omit<
	React.ComponentProps<'video'>,
	| 'src'
	| 'srcObject'
>

export const HTMLVideoPlayer: React.FC<HTMLVideoPlayerProps> = ( { className } ) => (
	<video
		// eslint-disable-next-line react-hooks/refs
		ref={ useVideoPlayerStore().videoRef }
		className={ className }
	/>
)