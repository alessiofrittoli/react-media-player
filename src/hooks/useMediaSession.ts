import { useCallback, useEffect } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'
import { updatePositionState } from '@alessiofrittoli/media-utils'


export interface UseMediaSessionOptions
{
	/**
	 * The HTMLMediaElement.
	 * 
	 */
	media?: HTMLMediaElement
	/**
	 * Indicates whether to register the action handlers.
	 * 
	 * ⚠️ it is better to set `register` to `true` once and only after `media.play()` has been called.
	 */
	register: boolean
	/**
	 * A custom callback executed once user requested to play the media through browser/device controls.
	 * 
	 */
	onPlay?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to pause the media through browser/device controls.
	 * 
	 */
	onPause?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to stop the media through browser/device controls.
	 * 
	 * ⚠️ Stop requests always depend on browser support.
	 */
	onStop?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to play the previous media through browser/device controls.
	 * 
	 * ⚠️ Please note that if no `onPrev` function is given, the MediaSession functionality will not be enabled.
	 */
	onPrev?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to play the next media through browser/device controls.
	 * 
	 * ⚠️ Please note that if no `onNext` function is given, the MediaSession functionality will not be enabled.
	 */
	onNext?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to seek backward through browser/device controls.
	 * 
	 */
	onSeekBackward?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to seek forward through browser/device controls.
	 * 
	 */
	onSeekForward?: MediaSessionActionHandler
	/**
	 * A custom callback executed once user requested to seek to a specific time through browser/device controls.
	 * 
	 */
	onSeekTo?: MediaSessionActionHandler
}

const defaultSeekTime = 10
const playPauseEvents: ( keyof HTMLElementEventMap )[] = [ 'play', 'pause' ]


/**
 * Hook into MediaSession API for controlling media playback through system controls.
 * 
 * Manages MediaSession state and action handlers for play, pause, stop, seek, previous, and next operations.
 * Synchronizes the native media element's playback state with the MediaSession API and handles user interactions
 * through system media controls (e.g., keyboard shortcuts, media control buttons).
 * 
 * @param options An object defining options and callbacks. See {@link UseMediaSessionOptions} for more info.
 * 
 * @example
 * ```ts
 * const {
 *  state, hasNext, hasPrevious, togglePlayPause, stop, previous, next
 * } = useMediaPlayerController( { queue, media } )
 * 
 * useMediaSession( {
 *  media,
 *  register    : !! state,
 *  onPlay      : togglePlayPause,
 *  onPause     : togglePlayPause,
 *  onStop      : stop,
 *  onPrev      : hasPrevious ? previous : undefined,
 *  onNext      : hasNext ? next : undefined,
 * } )
 * ```
 */
export const useMediaSession = ( options: UseMediaSessionOptions ) => {

	const { register, media } = options
	const {
		onPlay, onPause, onStop, onPrev, onNext,
		onSeekBackward, onSeekForward, onSeekTo
	} = options


	/**
	 * Notify MediaSession about playback state by listening native play/pause event on media.
	 * 
	 * This is usually triggered when user plays/pauses the media with the keyboard or when `media.play()` or `media.pause()` methods are called.
	 */
	useEventListener( playPauseEvents, {
		target: media,
		listener: useCallback( event => {	
			if ( event.type === 'play' ) {
				navigator.mediaSession.playbackState = 'playing'
				return
			}
			navigator.mediaSession.playbackState = 'paused'
		}, [] )
	} )


	/**
	 * Handle play/pause MediaSession requests.
	 * 
	 */
	useEffect( () => {

		if ( ! media || ! register ) return

		if ( onPlay ) {
			/**
			 * Handle play media requests.
			 * 
			 */
			navigator.mediaSession.setActionHandler( 'play', onPlay )
		}

		if ( onPause ) {
			/**
			 * Handle pause media requests.
			 * 
			 */
			navigator.mediaSession.setActionHandler( 'pause', onPause )
		}

		if ( onStop ) {
			/**
			 * Handle stop media requests (supported since Chrome 77).
			 * 
			 */
			try {
				navigator.mediaSession.setActionHandler( 'stop', onStop )
			} catch ( error ) {
				console.warn( 'Warning! The "stop" media session action is not supported.', error )
			}
		}
		
	}, [ media, register, onPlay, onPause, onStop ] )
	

	/**
	 * Handle seek MediaSession requests.
	 * 
	 */
	useEventListener( 'loadedmetadata', {
		target		: register ? media : undefined,
		listener	: useCallback( () => {
		
			if ( ! media ) return

			const isLive = media.duration === Infinity

			if ( isLive ) {
							
				navigator.mediaSession.setActionHandler( 'seekbackward', null )
				navigator.mediaSession.setActionHandler( 'seekforward', null )

				try {
					navigator.mediaSession.setActionHandler( 'seekto', null )
				} catch ( error ) {
					console.warn( 'Couldn\'t de-register \'seekto\' MediaSession action handler since it is not supported by the current browser.', error )
				}

				return

			}


			/**
			 * Handle seek backward requests.
			 * 
			 */
			navigator.mediaSession.setActionHandler( 'seekbackward', details => {

				const skipTime		= details.seekOffset || defaultSeekTime
				media.currentTime	= Math.max( 0, media.currentTime - skipTime )
				
				updatePositionState( media )
				onSeekBackward?.( details )

			} )


			/**
			 * Handle seek backward requests.
			 * 
			 */
			navigator.mediaSession.setActionHandler( 'seekforward', details => {

				const skipTime		= details.seekOffset || defaultSeekTime
				media.currentTime	= Math.min( media.duration, media.currentTime + skipTime )
				
				updatePositionState( media )
				onSeekForward?.( details )

			} )


			/**
			 * Handle seek to requests (supported since Chrome 78).
			 * 
			 */
			try {

				navigator.mediaSession.setActionHandler( 'seekto', details => {
					
					const { seekTime } = details

					if ( typeof seekTime === 'undefined' ) return

					if ( details.fastSeek && ( 'fastSeek' in media ) ) {
						media.fastSeek( seekTime )
						updatePositionState( media )
						onSeekTo?.( details )
						return
					}

					media.currentTime = seekTime
					updatePositionState( media )
					onSeekTo?.( details )

				} )

			} catch ( error ) {

				console.warn( 'Warning! The "seekto" media session action is not supported.', error )

			}

		}, [ media, onSeekBackward, onSeekForward, onSeekTo ] ),
	} )


	/**
	 * Handle previous/next MediaSession requests.
	 * 
	 */
	useEffect( () => {

		if ( ! register ) return

		if ( onPrev ) {
			navigator.mediaSession.setActionHandler( 'previoustrack', onPrev )
		}

		if ( onNext ) {
			navigator.mediaSession.setActionHandler( 'nexttrack', onNext )
		}
		

	}, [ register, onPrev, onNext ] )

}