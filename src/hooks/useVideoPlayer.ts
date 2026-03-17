import { useEffect, useState, useRef } from 'react'
import type { Queue } from '@/types'
import { useMediaPlayer, type UseMediaPlayer, type UseMediaPlayerOptions } from '@/hooks/useMediaPlayer'


export type UseVideoPlayerOptions<T extends Queue = Queue> = Omit<UseMediaPlayerOptions<T>, 'media'>


export interface UseVideoPlayer<T extends Queue = Queue> extends UseMediaPlayer<T>
{
	/**
	 * The `React.RefObject` to attach to an `HTMLVideoElement`.
	 * 
	 */
	videoRef: React.RefObject<HTMLVideoElement | null>
}


/**
 * Easily handle React video players.
 * 
 * @param options An object defining required data. See {@link UseVideoPlayerOptions} for more info.
 * @returns An object defining media player state and utilities. See {@link UseMediaPlayer} for more info.
 */
export const useVideoPlayer = <T extends Queue = Queue>( options: UseVideoPlayerOptions<T> ): UseVideoPlayer<T> => {

	const videoRef = useRef<HTMLVideoElement>( null )

	// eslint-disable-next-line react-hooks/refs
	const [ media, setMedia ] = useState( videoRef.current || undefined )

	/**
	 * Create a new HTMLMediaElement once hook did mount.
	 * 
	 */
	useEffect( () => {
		if ( ! videoRef.current ) return
		setMedia( videoRef.current )
	}, [] )

	return { videoRef, ...useMediaPlayer<T>( { media, ...options } ) }

}