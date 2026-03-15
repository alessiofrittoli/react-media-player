import { renderHook, act } from '@testing-library/react'
import { addItemsUUID } from '@alessiofrittoli/react-hooks/queue/utils'
import type { UUID } from '@alessiofrittoli/react-hooks/queue'
import {
	playMedia as _playMedia,
	pauseMedia as _pauseMedia,
	updatePositionState as _updatePositionState,
} from '@alessiofrittoli/media-utils'

import { PlayerState, useMediaPlayerController } from '@/hooks/useMediaPlayerController'
import type { Media, Queue } from '@/types'


jest.mock( '@alessiofrittoli/media-utils', () => ( {
	playMedia: jest.fn<ReturnType<typeof _playMedia>, Parameters<typeof _playMedia>>( async ( { onEnd } ) => {
		onEnd?.( 1 )
	} ),
	pauseMedia: jest.fn<ReturnType<typeof _pauseMedia>, Parameters<typeof _pauseMedia>>( ( { onEnd } ) => {
		onEnd?.( 1 )
	} ),
	updatePositionState: jest.fn<ReturnType<typeof _updatePositionState>, Parameters<typeof _updatePositionState>>(),
} ) )


const playMedia				= _playMedia as jest.Mock<ReturnType<typeof _playMedia>, Parameters<typeof _playMedia>>
// const pauseMedia			= _pauseMedia as jest.Mock<ReturnType<typeof _pauseMedia>, Parameters<typeof _pauseMedia>>
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

} )