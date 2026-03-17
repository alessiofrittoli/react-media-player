import { useEffect } from 'react'

export interface UseMediaSessionPiPOptions
{
	/**
	 * Indicates whether to register the action handler.
	 * 
	 * ⚠️ Enter PiP requests always depends on browser support.
	 */
	register: boolean
	/**
	 * A custom callback executed once the user requested to enter PiP.
	 * 
	 */
	onEnterPiP: MediaSessionActionHandler
}


/**
 * Hook into MediaSession Picture-in-Picture requests.
 * 
 * @param options An object defining options and callbacks. See {@link UseMediaSessionPiPOptions} for more info. 
 */
export const useMediaSessionPiP = ( options: UseMediaSessionPiPOptions ) => {

	const { register, onEnterPiP } = options

	/**
	 * Handle enter Picture-in-Picture requests (supported since Chrome 120).
	 * 
	 */
	useEffect( () => {

		if ( ! register ) return

		try {

			// details.enterPictureInPictureReason === 'useraction' -> User clicked "Enter Picture-in-Picture" icon.
			// details.enterPictureInPictureReason === 'contentoccluded' -> Automatically enter picture-in-picture.

			// @ts-expect-error types not implemented yet
			navigator.mediaSession.setActionHandler( 'enterpictureinpicture', onEnterPiP )

		} catch ( error ) {

			console.warn( 'Warning! The "enterpictureinpicture" media session action is not supported.', error )
			
		}

	}, [ register, onEnterPiP ] )

}