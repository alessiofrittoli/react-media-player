import { useCallback } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

import {
	useVolume,
	type UseVolume,
	type UseVolumeOptions,
} from '@/hooks/useVolume'
import {
	PlayerState,
	useMediaPlayerController,
	type UseMediaPlayerController,
	type UseMediaPlayerControllerOptions,
} from '@/hooks/useMediaPlayerController'
import {
	useMediaPreload,
	type UseMediaPreload,
} from '@/hooks/useMediaPreload'
import {
	useMediaPlayerLoading,
	type UseMediaPlayerLoading,
} from '@/hooks/useMediaPlayerLoading'

import { useMediaSession } from '@/hooks/useMediaSession'
import type { Queue } from '@/types'


export interface UseMediaPlayerOptions<T extends Queue = Queue> extends UseVolumeOptions,
	Omit<UseMediaPlayerControllerOptions<T>, 'volumeRef'>
{
	/**
	 * Indicates whether to preload next media when current media is about to end.
	 * 
	 * @default true
	 */
	preload?: boolean
}


export interface UseMediaPlayer<T extends Queue = Queue> extends UseVolume, UseMediaPlayerController<T>, UseMediaPreload, UseMediaPlayerLoading
{
	/**
	 * The given `HTMLMediaElement`.
	 * 
	 */
	media?: HTMLMediaElement
}


/**
 * Easily handle React media players.
 * 
 * @param	options An object defining media player options. See {@link UseMediaPlayerOptions} for more info.
 * @returns	An object defining media player state and utilities. See {@link UseMediaPlayer} for more info.
 */
export const useMediaPlayer = <T extends Queue = Queue>(
	options: UseMediaPlayerOptions<T>
): UseMediaPlayer<T> => {
	
	const {
		media, volume: initialVolume,
		normalizeVolume, playPauseFadeDuration: fade, preload = true,
	} = options

	const volumeController	= useVolume( { media, volume: initialVolume, fade, normalizeVolume } )
	const { volumeRef }		= volumeController
	const controller		= useMediaPlayerController<T>( { ...options, volumeRef } )
	const {
		state, hasNext, hasPrevious, togglePlayPause, stop, previous, next,
	} = controller

	const loadingController		= useMediaPlayerLoading( { media } )
	const preloadController		= useMediaPreload( { ...options, controller } )
	const { preloadNextMedia }	= preloadController
	

	/**
	 * Handle MediaSession updates.
	 * 
	 */
	useMediaSession( {
		media,
		register: state !== PlayerState.STOPPED,
		onPlay	: togglePlayPause,
		onPause	: togglePlayPause,
		onStop	: stop,
		onPrev	: hasPrevious ? previous : undefined,
		onNext	: hasNext ? next : undefined,
	} )


	/**
	 * Handle preload next media when current media is about to end.
	 * 
	 */
	useEventListener( 'canplaythrough', {
		target: preload ? media : undefined,
		listener: useCallback( () => {
			
			if ( ! preload ) return
			if ( ! media ) return
			if ( ! hasNext ) return

			preloadNextMedia( false )

		}, [ media, preload, hasNext, preloadNextMedia ] )
	} )


	/**
	 * Handle preload next media when current media is about to end.
	 * 
	 */
	useEventListener( 'timeupdate', {
		target: preload ? media : undefined,
		listener: useCallback( () => {
			
			if ( ! preload ) return
			if ( ! media ) return
			if ( ! hasNext ) return
			
			const remainingTime	= media.duration - media.currentTime
			const canPreload	= remainingTime <= 30
			
			if ( ! canPreload ) return

			preloadNextMedia()

		}, [ media, preload, hasNext, preloadNextMedia ] )
	} )


	return {
		media,
		...controller,
		...volumeController,
		...preloadController,
		...loadingController,
	}

}