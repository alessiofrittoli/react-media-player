import { useCallback, useEffect, useRef, useState } from 'react'
import { Url } from '@alessiofrittoli/url-utils'
import { Tween } from '@alessiofrittoli/math-utils'
import { useEventListener } from '@alessiofrittoli/react-hooks'
import { useQueue } from '@alessiofrittoli/react-hooks/queue'
import type { UseQueue, NewQueue, QueuedItemType, UUID, UseQueueOptions } from '@alessiofrittoli/react-hooks/queue'
import { pauseMedia, playMedia, updatePositionState } from '@alessiofrittoli/media-utils'

import type { UseVolume } from '@/hooks/useVolume'
import type { Queue, InitialMedia } from '@/types'

/**
 * The media player state.
 * 
 */
export enum PlayerState
{
	/**
	 * The media player is currently playing.
	 * 
	 */
	PLAYING = 'playing',
	/**
	 * The media player is currently paused.
	 * 
	 */
	PAUSED = 'paused',
	/**
	 * The media player hasn't been started yet or has been stopped.
	 * 
	 */
	STOPPED = 'stopped',
}


/**
 * Defines play/pause media handler options.
 * 
 */
export type PlayPauseHandlerOptions<T extends Queue = Queue> = {
	/**
	 * Volume fade in milliseconds applied when soundtrack start playing/get paused.
	 * 
	 * @default 200
	 */
	fade?: number
	/**
	 * A new queue to set.
	 * 
	 */
	queue?: NewQueue<T>
} & (
	| {
		/**
		 * Play specific media with the given `uuid`.
		 * 
		 */
		uuid: UUID
		stop?: never
		previous?: never
		next?: never
	} | {
		uuid?: never
		/**
		 * Stop media player.
		 * 
		 */
		stop?: boolean
		/**
		 * Play previous media.
		 * 
		 */
		previous?: boolean
		/**
		 * Play next media.
		 * 
		 */
		next?: boolean
	}
)


/**
 * Play/pause/stop the media player or start another media.
 * 
 * @param options An object specifing play/pause options. See {@link PlayPauseHandlerOptions}.
 * @returns The queued item being played.
 */
export type PlayPauseHandler<T extends Queue = Queue> = (
	options?: PlayPauseHandlerOptions<T>
) => QueuedItemType<T> | undefined


export type UtilityPlayPauseHandler<T extends Queue = Queue> = () => ReturnType<PlayPauseHandler<T>>


/**
 * A callback executed when media player is playing and transitioning to another media.
 * 
 * @param info An object containing new playing media data.
 */
export type MediaChangeHandler<
	T extends Queue = Queue
> = ( info: { data: QueuedItemType<T> } ) => void


/**
 * A callback executed when an error occurs when playing a media.
 * 
 * @param error The MediaError interface representing the occured error.
 */
export type PlaybackErrorHandler = ( error: MediaError ) => void


/**
 * Configuration options for the `useMediaPlayerController` hook.
 * 
 */
export interface UseMediaPlayerControllerOptions<T extends Queue>
	extends Partial<Pick<UseVolume, 'volumeRef'>>,
	Pick<UseQueueOptions, 'repeat'>
{
	/**
	 * The HTMLMediaElement.
	 * 
	 */
	media?: HTMLMediaElement
	/**
	 * An object describing the queue.
	 * 
	 */
	queue: T
	/**
	 * Defines the initial queue media to load.
	 * 
	 */
	initialMedia?: InitialMedia<QueuedItemType<T>>
	/**
	 * Indicates time in milliseconds after that the media restart to `0` rather than playing the previous one.
	 * 
	 * This only take effect when `previous()` method is called.
	 * 
	 * You can opt-out by this functionality by setting `restartThreshold` to `false` or `0`.
	 * 
	 * @default 5000
	 */
	restartThreshold?: number | false
	/**
	 * Volume fade in milliseconds applied when soundtrack start playing/get paused.
	 * 
	 * @default 200
	 */
	playPauseFadeDuration?: number
	/**
	 * A callback executed when media player is playing and transitioning to another media.
	 * 
	 * @param info An object containing new playing media data.
	 */
	onMediaChange?: MediaChangeHandler<T>
	/**
	 * A callback executed when an error occurs when playing a media.
	 * 
	 * @param error The MediaError interface representing the occured error.
	 */
	onPlaybackError?: PlaybackErrorHandler
}


/**
 * The return type of the `useMediaPlayerController` hook.
 * 
 */
export interface UseMediaPlayerController<T extends Queue = Queue> extends Omit<UseQueue<T>, 'previous' | 'next'>
{
	/**
	 * Defines the current media player state.
	 * 
	 */
	state: PlayerState
	/**
	 e Defines whether the media player is currently playing.
	 * 
	 */
	isPlaying: boolean
	/**
	 * Play/pause/stop the media player or start another media.
	 * 
	 * @param options An object specifing play/pause options. See {@link PlayPauseHandlerOptions}.
	 * @returns The queued item being played.
	 */
	playPause: PlayPauseHandler<T>
	/**
	 * Toggle play/pause.
	 * 
	 * @returns The queued item being played/paused.
	 */
	togglePlayPause: UtilityPlayPauseHandler<T>
	/**
	 * Stop media player.
	 * 
	 * @returns The queued item that was playing before stopping the media player if any.
	 */
	stop: UtilityPlayPauseHandler<T>
	/**
	 * Play previous queued media.
	 * 
	 * @returns The queued item being played if any.
	 */
	previous: UtilityPlayPauseHandler<T>
	/**
	 * Play next queued media.
	 * 
	 * @returns The queued item being played if any.
	 */
	next: UtilityPlayPauseHandler<T>
}


/**
 * React media player controller state.
 * 
 * @param	options An object defining media player options. See {@link UseMediaPlayerControllerOptions} for more info.
 * @returns	An object defining media player state and utilities. See {@link UseMediaPlayerController} for more info.
 */
export const useMediaPlayerController = <T extends Queue = Queue>(
	options: UseMediaPlayerControllerOptions<T>
): UseMediaPlayerController<T> => {

	const {
		media, queue: initialQueue, volumeRef, initialMedia,
		restartThreshold = 5000, playPauseFadeDuration, repeat, onMediaChange, onPlaybackError,
	} = options


	const {
		current, currentId, hasNext, jumpTo,
		previous: prevInQueue, next: nextInQueue, ...queueController
	} = useQueue( {
		queue	: initialQueue,
		current	: initialMedia,
		repeat	: repeat,
	} )

	const initialLoadedRef = useRef( false )

	const [ state, setState ] = useState<PlayerState>( PlayerState.STOPPED )

	const isPlaying = state === PlayerState.PLAYING
	
	const playPause = useCallback<PlayPauseHandler<T>>( ( options = {} ) => {

		const {
			uuid, stop, previous, next, fade = playPauseFadeDuration, queue
		} = options

		const playingUUID = current?.uuid

		if ( ! media ) return current

		if ( stop ) {
			pauseMedia( { media, fade, onEnd() {
				navigator.mediaSession.playbackState = 'none'
			}, } )
			setState( PlayerState.STOPPED )
			return current
		}

		const volume = volumeRef?.current ?? 1


		/**
		 * Indicates whether the current media is playing.
		 * 
		 */
		const isPlaying	= state === PlayerState.PLAYING


		if ( isPlaying ) {
			/**
			 * Should pause media player if:
			 * - not requesting previous or next media.
			 * - not requesting to set a new queue.
			 * - media is already playing and no specific cursor has been provided.
			 * - the player is already playing the media matching the given cursor.
			 */
			const shouldPause = (
				( ! previous && ! next && ! queue ) && ( ! uuid || uuid === playingUUID )
			)

			if ( shouldPause ) {
				/**
				 * fade-out current playing media and pause it.
				 * 
				 */
				pauseMedia( { media, fade } )
				setState( PlayerState.PAUSED )
				return current
			}

			const data = (
				previous ? prevInQueue() : (
					! queue && ( next || ! uuid )
						? nextInQueue()
						: jumpTo( { uuid: uuid, queue } )
				)
			)

			if ( data ) {

				/**
				 * fade-out current playing media and start requested media.
				 * 
				 */
				pauseMedia( { media, fade, onEnd() {
					media.src = Url.format( data.src )
					media.load()

					playMedia( { media, data, volume, fade, onError( error ) {
						// alert( 'FIXME: i should be able to easly play next media.' )
						onPlaybackError?.( error )
						setState( PlayerState.PAUSED )
					} } )

					onMediaChange?.( { data } )
				} } )

				setState( PlayerState.PLAYING )

				return data

			}

		}


		const mediaCursor = uuid || playingUUID
		const data = (
			previous ? prevInQueue() : (
				! queue && ( next || ! mediaCursor )
					? nextInQueue()
					: jumpTo( { uuid: mediaCursor, queue } )
			)
		)

		if ( ! data ) {
			setState( PlayerState.STOPPED )
			return
		}

		const playingADifferentMedia = playingUUID !== data.uuid

		if (
			playingADifferentMedia ||
			media.duration === Infinity
		) {
			// eslint-disable-next-line react-hooks/immutability
			media.src = Url.format( data.src )
			media.load()
		}

		const volumeFade = (
			state === PlayerState.STOPPED
				? data.fade?.in ?? fade
				: fade
		)

		playMedia( { media, data, volume, fade: volumeFade, onError( error ) {
			// alert( 'FIXME: i should be able to easly play next media.' )
			onPlaybackError?.( error )
			setState( PlayerState.PAUSED )
		}, } )


		if ( playingADifferentMedia ) {
			onMediaChange?.( { data } )
		}

		setState( PlayerState.PLAYING )

		return data

	}, [
		state, media, current, volumeRef, playPauseFadeDuration,
		prevInQueue, nextInQueue, jumpTo, onPlaybackError, onMediaChange,
	] )


	/**
	 * Toggle play/pause media.
	 * 
	 */
	const togglePlayPause = useCallback<UtilityPlayPauseHandler<T>>( () => playPause(), [ playPause ] )
	
	
	/**
	 * Stop media player.
	 * 
	 */
	const stop = useCallback<UtilityPlayPauseHandler<T>>( () => playPause( { stop: true } ), [ playPause ] )


	/**
	 * Play previous media.
	 * 
	 */
	const previous = useCallback<UtilityPlayPauseHandler<T>>( () => {
		
		if (
			! media || ! restartThreshold ||
			( media && media.currentTime <= ( restartThreshold / 1000 ) )
		) {
			return playPause( { previous: true } )
		}

		// eslint-disable-next-line react-hooks/immutability
		media.currentTime = 0
		updatePositionState( media )

	}, [ media, restartThreshold, playPause ] )

	
	/**
	 * Play next media.
	 * 
	 */
	const next = useCallback<UtilityPlayPauseHandler<T>>( () => playPause( { next: true } ), [ playPause ] )


	/**
	 * Handle fade-out volume when media is about to end.
	 * Play next media in queue after fade-out completed.
	 * 
	 */
	useEventListener( 'timeupdate', {
		target	: media,
		listener: useCallback( () => {

			if ( ! media ) return
			if ( ! current ) return

			const fadeDuration = (
				current.fade?.out ?? playPauseFadeDuration ?? Tween.Duration
			)
			const exitCuePoint = current.fadeCuePoints?.out || fadeDuration

			const shouldFade = (
				Math.floor( media.currentTime ) === Math.floor( media.duration - ( exitCuePoint / 1000 ) )
			)

			if ( ! shouldFade ) return
			
			pauseMedia( { media, fade: fadeDuration, onEnd() {

				const volume	= volumeRef?.current ?? 1
				const data		= nextInQueue()

				if ( ! hasNext || ! data ) {
					return stop()
				}

				media.src = Url.format( data.src )
				media.load()

				playMedia( { media, data, volume, fade: data.fade?.in ?? playPauseFadeDuration, onError( error ) {
					setState( PlayerState.PAUSED )
					onPlaybackError?.( error )
				}, } )

				setState( PlayerState.PLAYING )

				onMediaChange?.( { data } )

			} } )

		}, [
			current, media, hasNext, playPauseFadeDuration, volumeRef,
			nextInQueue, stop, onMediaChange, onPlaybackError,
		] )
	} )


	/**
	 * Play next media when current media ends.
	 * 
	 */
	useEventListener( 'ended', {
		target	: media,
		listener: useCallback( () => {
			if ( hasNext ) return next()
			stop()
		}, [ hasNext, next, stop ] ),
	} )


	/**
	 * Load initial media.
	 * 
	 */
	useEffect( () => {

		if ( ! media ) return
		if ( ! initialMedia ) return
		if ( initialLoadedRef.current ) return

		// eslint-disable-next-line react-hooks/immutability
		media.src = Url.format( initialMedia.src )

		if ( initialMedia?.time ) {
			media.currentTime = initialMedia.time
		}

		media.load()

		initialLoadedRef.current = true

	}, [ media, initialMedia ] )


	return {
		// defined by `useMediaPlayerController`
		state, isPlaying, playPause, togglePlayPause, stop, previous, next,
		// defined by `useQueue`
		current, currentId, hasNext, jumpTo, ...queueController,
	}

}