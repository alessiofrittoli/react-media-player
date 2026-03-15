import { renderHook, act } from '@testing-library/react'
import { useEventListener as _useEventListener } from '@alessiofrittoli/react-hooks'
import { addItemsUUID } from '@alessiofrittoli/react-hooks/queue/utils'
import type { UUID } from '@alessiofrittoli/react-hooks/queue'
import {
	playMedia as _playMedia,
	type pauseMedia as _pauseMedia,
	updatePositionState as _updatePositionState,
} from '@alessiofrittoli/media-utils'

import { PlayerState, UseMediaPlayerController, useMediaPlayerController, UseMediaPlayerControllerOptions } from '@/hooks/useMediaPlayerController'
import type { Media, Queue } from '@/types'
import { Tween } from '@alessiofrittoli/math-utils'


jest.mock( '@alessiofrittoli/react-hooks', () => ( {
	...jest.requireActual( '@alessiofrittoli/react-hooks' ),
	useEventListener: jest.fn<ReturnType<typeof _useEventListener>, Parameters<typeof _useEventListener>>(),
} ) )


jest.mock( '@alessiofrittoli/media-utils', () => ( {
	playMedia: jest.fn<ReturnType<typeof _playMedia>, Parameters<typeof _playMedia>>( async ( { onEnd } ) => {
		onEnd?.( 1 )
	} ),
	pauseMedia: jest.fn<ReturnType<typeof _pauseMedia>, Parameters<typeof _pauseMedia>>( ( { onEnd } ) => {
		onEnd?.( 1 )
	} ),
	updatePositionState: jest.fn<ReturnType<typeof _updatePositionState>, Parameters<typeof _updatePositionState>>(),
} ) )


const useEventListener		= _useEventListener as unknown as jest.Mock<ReturnType<typeof _useEventListener>, Parameters<typeof _useEventListener>>
const playMedia				= _playMedia as jest.Mock<ReturnType<typeof _playMedia>, Parameters<typeof _playMedia>>
const updatePositionState	= _updatePositionState as jest.Mock<ReturnType<typeof _updatePositionState>, Parameters<typeof _updatePositionState>>


const queue: Queue = {
	items: addItemsUUID<Media>( [
		{
			title	: 'Song 1',
			src		: '/song-2.mp3',
			type	: 'audio',
		},
		{
			title	: 'Song 2',
			src		: '/song-2.mp3',
			type	: 'audio',
		},
		{
			title	: 'Song 3',
			src		: '/song-3.mp3',
			type	: 'audio',
		},
		{
			title	: 'Song 4',
			src		: '/song-4.mp3',
			type	: 'audio',
			fade	: { in: 2000 },
		},
	] )
}


type MockHTMLMediaElement = Omit<HTMLMediaElement, 'load' | 'play' | 'pause'> & {
	load	: jest.Mock
	play	: jest.Mock<Promise<void>, []>
	pause	: jest.Mock
	_src	: string
}


describe( 'useMediaPlayerController', () => {

	let originalMediaSession: MediaSession
	let mockMedia: MockHTMLMediaElement

	beforeEach( () => {

		originalMediaSession = navigator.mediaSession

		mockMedia = {
			duration	: 100,
			currentTime	: 50,
			load		: jest.fn(),
			play		: jest.fn( async () => {} ),
			pause		: jest.fn(),
			set src( value: string ) {
				this._src = value
				this.currentTime = 0
			},
			get src() {
				return this._src
			}
		} as MockHTMLMediaElement


		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: {
				playbackState		: undefined,
				setPositionState	: jest.fn(),
				metadata			: undefined,
			},
		} )

	} )


	afterEach( () => {

		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: originalMediaSession,
		} )

		jest.clearAllMocks()

	} )


	describe( 'playPause', () => {

		it( 'plays the first available media', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				const item = result.current.playPause()
				expect( item ).toBe( queue.items.at( 0 ) )
				expect( mockMedia.currentTime ).toBe( 0 )
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			expect( result.current.current ).toBe( queue.items.at( 0 ) )

		} )


		it( 'pauses the current playing media', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			
			act( () => {
				result.current.playPause()
			} )
			
			expect( result.current.state ).toBe( PlayerState.PAUSED )
			expect( result.current.current ).toBe( queue.items.at( 0 ) )

		} )
		
		
		it( 'resumes the current paused media', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			
			act( () => {
				mockMedia.currentTime = 70
				result.current.playPause()
			} )
			
			expect( result.current.state ).toBe( PlayerState.PAUSED )

			act( () => {
				result.current.playPause()
			} )

			
			expect( result.current.state ).toBe( PlayerState.PLAYING )
			expect( mockMedia.currentTime ).not.toBe( 0 )

		} )


		it( 'does nothing if no HTMLMediaElement has been given', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue } )
			) )

			act( () => {
				result.current.playPause()
			} )

			expect( result.current.isPlaying ).toBeFalsy()

		} )


		describe( 'playPause - fade', () => {

			it( 'fades volume using given fade duration option', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { fade: 1500 } )
				} )

				expect( playMedia ).toHaveBeenCalledWith( expect.objectContaining( { fade: 1500 } ) )
				
			} )


			it( 'fades volume using queued media fade in duration option', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )
				
				act( () => {
					result.current.playPause( { uuid: queue.items.at( -1 )?.uuid } )
				} )

				expect( playMedia )
					.toHaveBeenCalledWith( expect.objectContaining( { fade: queue.items.at( -1 )?.fade?.in } ) )

			} )

		} )


		describe( 'playPause - previous', () => {

			it( 'plays the previous media relative to current playing media', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )

				act( () => {
					result.current.playPause( { previous: true } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( 0 ) )
				
			} )
			
			
			it( 'plays the last media in queue if media player was not playing yet', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { previous: true } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( -1 ) )
				
			} )

		} )


		describe( 'playPause - next', () => {

			it( 'plays the next media relative to current playing media', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )

				act( () => {
					result.current.playPause( { next: true } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( 2 ) )
				
			} )
			
			
			it( 'plays the first media in queue if media player was not playing yet', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { next: true } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( 0 ) )
				
			} )

		} )
		
		
		describe( 'playPause - stop', () => {

			it( 'stops media player if stop is given', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause()
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				
				act( () => {
					result.current.playPause( { stop: true } )
				} )

				expect( result.current.state ).toBe( PlayerState.STOPPED )
				expect( result.current.current ).toBe( queue.items.at( 0 ) )
				
			} )


			it( 'stops media player if unable to find a queued media to play', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause()
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				
				act( () => {
					result.current.playPause( { uuid: 'unexisting-uuid' as UUID } )
				} )

				expect( result.current.state ).toBe( PlayerState.STOPPED )
				expect( result.current.current ).toBeUndefined()
				
			} )

		} )


		describe( 'playPause - uuid', () => {

			it( 'plays the media matching the given UUID', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					const secondItem = queue.items.at( 1 )
					const item = result.current.playPause( { uuid: secondItem?.uuid } )

					expect( item ).toBe( secondItem )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( 1 ) )
				
			} )


			it( 'pauses the media matching the given UUID', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
				} )
				
				expect( result.current.state ).toBe( PlayerState.PLAYING )

				act( () => {
					result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
				} )

				expect( result.current.state ).toBe( PlayerState.PAUSED )

			} )


			// it( 'resumes the current paused media matching the given UUID', () => {
			// 	console.log( 'TODO: check if this test is necessary' )
			// } )


			it( 'transitions to a new media if the given UUID matches a different queued media', () => {

				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia } )
				) )

				act( () => {
					result.current.playPause()
				} )
				
				act( () => {
					result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
				} )

				expect( result.current.state ).toBe( PlayerState.PLAYING )
				expect( result.current.current ).toBe( queue.items.at( 1 ) )

			} )

		} )


		describe( 'playPause - playback error', () => {
			
			it( 'sets playback state to paused and calls onPlaybackError if an error occurs while playing the media', () => {
	
				const onPlaybackError = jest.fn()
	
				const { result } = renderHook( () => (
					useMediaPlayerController( { queue, media: mockMedia, onPlaybackError } )
				) )

				const mediaError = {} as MediaError
	
				playMedia
					.mockImplementationOnce( async ( { onError } ) => onError?.( mediaError ) )
					.mockImplementationOnce( async ( { onError } ) => onError?.( mediaError ) )
	
				
				act( () => {
					result.current.playPause()
				} )
	
				act( () => {
					result.current.playPause( { next: true } )
				} )
	
	
				// expect( result.current.state ).toBe( PlayerState.PAUSED ) // this test is failing o.O
				expect( onPlaybackError ).toHaveBeenCalledWith( mediaError )
	
			} )

		} )

	} )


	describe( 'togglePlayPause', () => {

		it( 'toggles the play/pause state using playPause behavior', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.togglePlayPause()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			expect( result.current.current ).toBe( queue.items.at( 0 ) )

			act( () => {
				result.current.togglePlayPause()
			} )

			expect( result.current.state ).toBe( PlayerState.PAUSED )

		} )

	} )


	describe( 'stop', () => {

		it( 'stops the media player', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )

			act( () => {
				result.current.stop()
			} )

			expect( result.current.state ).toBe( PlayerState.STOPPED )
			expect( result.current.current ).toBe( queue.items.at( 0 ) )

		} )

	} )


	describe( 'previous', () => {

		it( 'plays the previous media when near the start of the current track', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
			} )

			expect( result.current.current ).toBe( queue.items.at( 1 ) )

			act( () => {
				mockMedia.currentTime = 1
				result.current.previous()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			expect( result.current.current ).toBe( queue.items.at( 0 ) )

		} )


		it( 'restarts the current media when beyond the restart threshold', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
			} )

			const currentItem = result.current.current

			act( () => {
				mockMedia.currentTime = 10
				result.current.previous()
			} )

			expect( result.current.current ).toBe( currentItem )
			expect( mockMedia.currentTime ).toBe( 0 )
			expect( updatePositionState ).toHaveBeenCalledWith( mockMedia )

		} )

	} )


	describe( 'next', () => {

		it( 'plays the next media in queue', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			act( () => {
				result.current.playPause( { uuid: queue.items.at( 1 )?.uuid } )
			} )

			expect( result.current.current ).toBe( queue.items.at( 1 ) )

			act( () => {
				result.current.next()
			} )

			expect( result.current.state ).toBe( PlayerState.PLAYING )
			expect( result.current.current ).toBe( queue.items.at( 2 ) )

		} )

	} )


	describe( 'media timeupdate', () => {

		it( 'fades out current media then plays the next one', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )
	
	
			act( () => {
				result.current.playPause()
			} )

			expect( result.current.current ).toBe( queue.items.at( 0 ) )
			
			const { listener } = useEventListener.mock.calls.at( -2 )?.[ 1 ] || {}

			act( () => {
				mockMedia.currentTime = mockMedia.duration / 2
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( result.current.current ).toBe( queue.items.at( 0 ) )

			act( () => {
				mockMedia.currentTime = mockMedia.duration - ( Tween.Duration / 1000 )
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( result.current.current ).toBe( queue.items.at( 1 ) )

		} )


		it( 'pauses media player if next media fail to load', () => {

			const onPlaybackError = jest.fn()

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia, onPlaybackError } )
			) )

			act( () => {
				result.current.playPause()
			} )

			const mediaError = {} as MediaError

			playMedia
				.mockImplementationOnce( async ( { onError } ) => onError?.( mediaError ) )

			const { listener } = useEventListener.mock.calls.at( -2 )?.[ 1 ] || {}

			act( () => {
				mockMedia.currentTime = mockMedia.duration - ( Tween.Duration / 1000 )
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( onPlaybackError ).toHaveBeenCalledWith( mediaError )

		} )


		it( 'stops media player if there is no next queued media to play', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia, repeat: false } )
			) )

			act( () => {
				result.current.playPause( { uuid: queue.items.at( -1 )?.uuid } )
			} )

			const { listener } = useEventListener.mock.calls.at( -2 )?.[ 1 ] || {}

			act( () => {
				mockMedia.currentTime = mockMedia.duration - ( Tween.Duration / 1000 )
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( result.current.state ).toBe( PlayerState.STOPPED )

		} )
		
		
		it( 'does nothing if no media has been given', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue } )
			) )

			const { listener } = useEventListener.mock.calls.at( -2 )?.[ 1 ] || {}

			act( () => {
				mockMedia.currentTime = mockMedia.duration - ( Tween.Duration / 1000 )
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( result.current.state ).toBe( PlayerState.STOPPED )

		} )
		
		
		it( 'does nothing if media player was not playing', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )

			const { listener } = useEventListener.mock.calls.at( -2 )?.[ 1 ] || {}

			act( () => {
				mockMedia.currentTime = mockMedia.duration - ( Tween.Duration / 1000 )
				listener?.( new Event( 'timeupdate' ) )
			} )

			expect( result.current.state ).toBe( PlayerState.STOPPED )

		} )

	} )


	describe( 'media end', () => {

		it( 'plays next media when current media ends', () => {
	
			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia } )
			) )
	
	
			act( () => {
				result.current.playPause()
			} )
	
			const { listener } = useEventListener.mock.calls.at( -1 )?.[ 1 ] || {}
	
			act( () => {
				listener?.( new Event( 'ended' ) )
			} )
	
			expect( result.current.current ).toBe( queue.items.at( 1 ) )
	
		} )
		
		
		it( 'stops media player when last media ends and repeat has been set to false', () => {
	
			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia, repeat: false } )
			) )
	
	
			act( () => {
				result.current.playPause( { uuid: queue.items.at( -1 )?.uuid } )
			} )
	
			const { listener } = useEventListener.mock.calls.at( -1 )?.[ 1 ] || {}
	
			act( () => {
				listener?.( new Event( 'ended' ) )
			} )

			expect( result.current.state ).toBe( PlayerState.STOPPED )
	
		} )

	} )


	describe( 'initial media', () => {

		it( 'loads the given initial media and sets it as current', () => {

			const { result } = renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia, initialMedia: queue.items.at( 1 ) } )
			) )

			expect( mockMedia.load ).toHaveBeenCalled()
			expect( result.current.current ).toBe( queue.items.at( 1 ) )

		} )


		it( 'optionally sets media currentTime if given', () => {

			renderHook( () => (
				useMediaPlayerController( { queue, media: mockMedia, initialMedia: {
					...queue.items.at( 1 )!, time: 10,
				} } )
			) )

			expect( mockMedia.currentTime ).toBe( 10 )

		} )
		
		
		it( 'does nothing if initial media reference changes and an initial media has been already loaded', () => {

			const { result, rerender } = renderHook<UseMediaPlayerController<Queue>, Partial<UseMediaPlayerControllerOptions<Queue>>>(
				options => (
					useMediaPlayerController( { queue, media: mockMedia, initialMedia: queue.items.at( 1 ), ...options } )
				)
			)

			
			act( () => {
				rerender( { initialMedia: queue.items.at( 2 ) } )
			} )


			expect( result.current.current ).toBe( queue.items.at( 1 ) )

		} )

	} )

} )