import { useCallback, useEffect, useRef } from 'react'
import { Url } from '@alessiofrittoli/url-utils'
import { getTypedMap } from '@alessiofrittoli/web-utils'
import { clamp } from '@alessiofrittoli/math-utils'

import { getPreloadStrategy, type Media } from '@alessiofrittoli/media-utils'
import type { Queue, UseMediaPlayerController } from '@alessiofrittoli/react-media-player'


const MAX_CACHE_ENTRIES = 3

interface MediaMap
{
	audio: HTMLMediaElement
	video: HTMLMediaElement
}


export type PreloadMediaHandler = ( media: Media ) => void


export interface UseMediaPreloadOptions<T extends Queue = Queue>
{
	/**
	 * The media player controller.
	 * 
	 */
	controller: UseMediaPlayerController<T>
	/**
	 * Defines the maximum cache entries.
	 * 
	 * @default 3
	 */
	cacheEntries?: number
	/**
	 * Defines whether preload is enabled based on user connection quality.
	 * 
	 * @default true
	 */
	checkConnection?: boolean
}


export interface UseMediaPreload
{
	/**
	 * Preload media.
	 * 
	 * @param media The media details. See {@link Media} for more info.
	 */
	preloadMedia: PreloadMediaHandler
	/**
	 * Preload previous media.
	 * 
	 */
	preloadPreviousMedia: VoidFunction
	/**
	 * Preload next media.
	 * 
	 */
	preloadNextMedia: VoidFunction
}


/**
 * Handle media preload.
 * 
 * @param options An object defining media preload options. See {@link UseMediaPreloadOptions} for more info.
 * 
 * @returns An object containing preload functions.
 */
export const useMediaPreload = <T extends Queue = Queue>( options: UseMediaPreloadOptions<T> ): UseMediaPreload => {

	const {
		controller,
		cacheEntries	= MAX_CACHE_ENTRIES,
		checkConnection	= true,
	} = options

	const { getPrevious, getNext } = controller

	/** Defines the maximum cache entries. */
	const clampedCacheEntries = clamp( cacheEntries, 0, Infinity )

	/**
	 * Defines a Map that stores HTMLMediaElement(s) used to preload media.
	 * 
	 * This allows us to avoid HTMLMediaElement recreation and related memory leaks.
	 */
	const mediaMapRef = useRef( getTypedMap<MediaMap>() )

	/**
	 * Defines a Set of preloaded URLs.
	 * 
	 */
	const preloadedSetRef = useRef( new Set<string>() )


	const preloadMedia = useCallback<PreloadMediaHandler>( media => {

		const src			= Url.format( media.src )
		const preloadedSet	= preloadedSetRef.current
		
		if ( preloadedSet.has( src ) ) return
		
		const preload		= checkConnection ? getPreloadStrategy() : 'auto'
		const mediaMap		= mediaMapRef.current
		const isAudio		= media.type === 'audio'
		const mediaMapKey	= isAudio ? 'audio' : 'video'

		const preloadMedia = (
			mediaMap.get( mediaMapKey ) ||
			mediaMap.set( mediaMapKey, (
				isAudio
					? new Audio()
					: document.createElement( 'video' )
			) ).get( mediaMapKey )!
		)

		// if ( preloadMedia.src === src ) return

		preloadMedia.preload	= preload
		preloadMedia.muted		= true
		preloadMedia.src		= src

		preloadMedia.load()

		// Least Recently Used (LRU) eviction
		if ( preloadedSet.size >= clampedCacheEntries ) {
			const first = preloadedSet.values().next().value
			if ( first ) {
				preloadedSet.delete( first )
			}
		}

		preloadedSet.add( src )

	}, [ checkConnection, clampedCacheEntries ] )


	const preloadPreviousMedia = useCallback( () => {

		const data = getPrevious()
		if ( ! data ) return
		
		preloadMedia( data )

	}, [ getPrevious, preloadMedia ] )


	const preloadNextMedia = useCallback( () => {

		const data = getNext()
		if ( ! data ) return

		preloadMedia( data )

	}, [ getNext, preloadMedia ] )


	useEffect ( () => {
		return () => {

			// eslint-disable-next-line react-hooks/exhaustive-deps
			preloadedSetRef.current.clear()

			// eslint-disable-next-line react-hooks/exhaustive-deps
			const mediaMap = mediaMapRef.current

			const audio = mediaMap.get( 'audio' )
			const video = mediaMap.get( 'video' )

			if ( audio ) {
				audio.src = ''
				audio.load()
			}

			if ( video ) {
				video.src = ''
				video.load()
			}

			mediaMap.clear()
		}
	}, [] )

	return { preloadMedia, preloadPreviousMedia, preloadNextMedia }

}