'use client'

import { useCallback, useRef } from 'react'
import { easing } from '@alessiofrittoli/math-utils'
import { AudioEngine, fadeVolume } from '@alessiofrittoli/media-utils/audio'


/**
 * Set volume.
 * 
 * @param volume The volume value to set [0-1].
 */
export type ChangeHandler = ( volume: number ) => void

/**
 * Toggle mute.
 * 
 * @returns `0` if muting, otherwise the volume value before the mute was activated.
 */
export type ToggleMuteHandler = () => number


/**
 * Configuration options for the useVolume hook.
 * 
 */
export interface UseVolumeOptions
{
	/**
	 * The HTMLMediaElement.
	 * 
	 */
	media?: HTMLMediaElement
	/**
	 * The master volume [0-1].
	 * 
	 * @default 1
	 */
	volume?: number
	/**
	 * Normalize master volume.
	 * 
	 * @default true
	 */
	normalizeVolume?: boolean
	/**
	 * Volume fade in milliseconds applied when toggling mute.
	 * 
	 * @default 200
	 */
	fade?: number
}


/**
 * The return type of the `useVolume` hook.
 * 
 * Provides volume control functionality including volume management, mute toggling,
 * and volume normalization for media players.
 */
export interface UseVolume
{
	/**
	 * A React RefObject that stores the master volume value [0-1].
	 * 
	 * This value may stores the normalized value if `normalizeVolume` has been set to `true`.
	 */
	volumeRef: React.RefObject<number>
	// /**
	//  * A React RefObject that stores the master volume value [0-1] before mute and normalization are applied.
	//  * 
	//  */
	// lastVolumeRef: React.RefObject<number>
	/**
	 * The initial master volume [0-1].
	 * 
	 */
	initialVolume: number
	/**
	 * Indicates whether volume normalization is applied.
	 * 
	 */
	normalizeVolume: boolean
	/**
	 * Set volume.
	 * 
	 * @param volume The volume value to set [0-1].
	 */
    setVolume: ChangeHandler
	/**
	 * Toggle mute.
	 * 
	 * @returns `0` if muting, otherwise the volume value before the mute was activated.
	 */
    toggleMute: ToggleMuteHandler
}


/**
 * Manage audio volume control.
 * 
 * @param options Configuration options for the volume hook.
 * 	See {@link UseVolumeOptions} for more info.
 * 
 * @returns An object providing volume control functionality
 * 	including volume management, mute toggling, and volume normalization for media players.
 * 	See {@link UseVolume} for more info.
 * 
 * @example
 * ```ts
 * const { setVolume, toggleMute, volumeRef } = useVolume( {
 *  media           : HTMLAudioElement | HTMLVideoElement,
 *  volume          : 0.8,
 *  normalizeVolume : true,
 *  fade            : 300,
 * } )
 * ```
 */
export const useVolume = ( options: UseVolumeOptions = {} ): UseVolume => {

	const {
		media, volume: initialVolume = 1, normalizeVolume = true, fade: duration
	} = options

	const volumeRef		= useRef( AudioEngine.normalize( initialVolume, normalizeVolume ) )
	const lastVolumeRef	= useRef( initialVolume )


	const setVolumeHandler = useCallback<ChangeHandler>(
		volume => {

			const normalized		= AudioEngine.normalize( volume, normalizeVolume )
			volumeRef.current		= normalized
			lastVolumeRef.current	= volume
						
			if ( ! media ) return

			// eslint-disable-next-line react-hooks/immutability
			media.volume = normalized

			if ( media.volume > 0 && media.muted ) {
				media.muted = false
			}

			if ( media.volume <= 0 ) {
				media.muted = true
			}

		}, [ media, normalizeVolume ]
	)


	const toggleMute = useCallback<ToggleMuteHandler>( () => {

		const prev		= volumeRef.current
		const volume	= prev > 0 ? 0 : Math.max( 0.2, lastVolumeRef.current )

		const normalized	= AudioEngine.normalize( volume, normalizeVolume )
		volumeRef.current	= normalized

		if ( ! media ) return volume

		if ( volume > 0 && media.muted ) {
			// eslint-disable-next-line react-hooks/immutability
			media.muted = false
		}
		

		fadeVolume( media, {
			to: normalized, duration, easing: easing.easeOutSine, onEnd() {
				if ( normalized <= 0 ) {
					media.muted = true
				}
			},
		} )

		return volume

	}, [ media, duration, normalizeVolume ] )


	return {
		volumeRef, initialVolume, normalizeVolume,
		setVolume: setVolumeHandler, toggleMute,
	}

}