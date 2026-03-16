import { useCallback, useState } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'


export interface UseMediaPlayerLoadingOptions
{
	/**
	 * The HTMLMediaElement.
	 * 
	 */
	media?: HTMLMediaElement
}


export interface UseMediaPlayerLoading
{
	/**
	 * Indicates whether the current media is loading.
	 * 
	 */
	isLoading: boolean
	/**
	 * The `MediaError` interface represents an error which occurred while handling
	 * media in an HTML media element based on [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement),
	 * such as [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio) or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaError)
	 */
	error?: MediaError
}

const events: ( keyof HTMLElementEventMap )[] = [ 'waiting', 'playing', 'loadstart', 'loadeddata', 'error' ]

/**
 * Handle media loading and error states.
 * 
 * @param options An object defining media player loading options. See {@link UseMediaPlayerLoadingOptions} for more info.
 * @returns An object defining loading and error states. See {@link UseMediaPlayerLoading} for more info.
 */
export const useMediaPlayerLoading = ( options: UseMediaPlayerLoadingOptions ): UseMediaPlayerLoading => {

	const { media }						= options
	const [ isLoading, setIsLoading ]	= useState( false )
	const [ error, setError ]			= useState<MediaError>()


	useEventListener( events, {
		target: media,
		listener: useCallback( event => {

			if ( ! media ) return

			switch ( event.type ) {
				case 'loadstart':
				case 'waiting':
					setIsLoading( true )
					setError( undefined )
					return
				case 'loadeddata':
				case 'playing':
					setIsLoading( false )
					setError( undefined )
					return
				case 'error': {
					const { error } = media
					setIsLoading( false )
					if ( ! error ) return
					setError( error )
					return
				}
			}

		}, [ media ] )
	} )

	return { isLoading, error }

}