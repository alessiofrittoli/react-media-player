import { useRef } from 'react'
import type { Queue } from '@/types'
import { useMediaPlayer, type UseMediaPlayer, type UseMediaPlayerOptions } from '@/hooks/useMediaPlayer'


export type UseAudioPlayerOptions<T extends Queue = Queue> = Omit<UseMediaPlayerOptions<T>, 'media'>


/**
 * Easily handle React audio players.
 * 
 * @param options An object defining required data. See {@link UseAudioPlayerOptions} for more info.
 * @returns An object defining media player state and utilities. See {@link UseMediaPlayer} for more info.
 */
export const useAudioPlayer = <T extends Queue = Queue>( options: UseAudioPlayerOptions<T> ): UseMediaPlayer<T> => (
	useMediaPlayer<T>( {
		// eslint-disable-next-line react-hooks/refs
		media: useRef( typeof window !== 'undefined' ? new Audio() : undefined ).current,
		...options
	} )
)

// export const useAudioPlayer = <T extends Queue = Queue>( options: UseAudioPlayerOptions<T> ): UseMediaPlayer<T> => {
	
// 	const [ media, setMedia ] = useState<HTMLMediaElement>()
	
// 	/**
// 	 * Create a new HTMLMediaElement once hook did mount.
// 	 * 
// 	 */
// 	useEffect( () => {
// 		if ( media ) return
// 		setMedia( new Audio() )
// 	}, [ media ] )

// 	return useMediaPlayer<T>( { media, ...options } )
// }