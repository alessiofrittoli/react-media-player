import { renderHook, act } from '@testing-library/react'
import { useVolume } from '@/hooks/useVolume'
import { AudioEngine, fadeVolume as _fadeVolume } from '@alessiofrittoli/media-utils/audio'


jest.mock( '@alessiofrittoli/media-utils/audio', () => ( {
	...jest.requireActual( '@alessiofrittoli/media-utils/audio' ),
	fadeVolume: jest.fn<ReturnType<typeof _fadeVolume>, Parameters<typeof _fadeVolume>>(
		( media, { to, onEnd } ) => {
			onEnd?.( to )
		}
	),
} ) )


const fadeVolume = (
	_fadeVolume
) as jest.Mock<ReturnType<typeof _fadeVolume>, Parameters<typeof _fadeVolume>>


describe( 'useVolume', () => {

	let mockMedia: HTMLMediaElement

	beforeEach( () => {

		mockMedia = {
			volume	: 1,
			muted	: false,
		} as HTMLMediaElement

		jest.clearAllMocks()

	} )


	describe( 'initialization', () => {

		it( 'initializes with default values', () => {

			const { result } = renderHook( () => useVolume() )

			expect( result.current.initialVolume ).toBe( 1 )
			expect( result.current.normalizeVolume ).toBe( true )
			expect( result.current.volumeRef.current ).toBe( 1 )

		} )


		it( 'initializes with custom volume', () => {

			const { result } = renderHook(
				() => useVolume( { volume: 0.8 } )
			)

			expect( result.current.initialVolume ).toBe( 0.8 )
			expect( result.current.normalizeVolume ).toBe( true )
			expect( result.current.volumeRef.current ).toBe( AudioEngine.normalize( 0.8 ) )

		} )


		it( 'respects normalizeVolume option', () => {

			const { result } = renderHook( () => useVolume( {
				volume			: 0.8,
				normalizeVolume	: false,
			} ) )

			expect( result.current.initialVolume ).toBe( 0.8 )
			expect( result.current.normalizeVolume ).toBe( false )
			expect( result.current.volumeRef.current ).toBe( 0.8 )

		} )

	} )


	describe( 'setVolume', () => {

		it( 'sets volume on ref', () => {

			const { result } = renderHook( () => useVolume() )

			act( () => {
				result.current.setVolume( 0.5 )
			} )

			expect( result.current.volumeRef.current )
				.toBe( AudioEngine.normalize( 0.5 ) )

		} )


		it( 'sets volume on media element', () => {

			const { result } = renderHook(
				() => useVolume( { media: mockMedia } )
			)

			act( () => {
				result.current.setVolume( 0.6 )
			} )

			expect( mockMedia.volume )
				.toBe( AudioEngine.normalize( 0.6 ) )

		} )


		it( 'mutes the media when setting volume to 0', () => {

			const { result } = renderHook(
				() => useVolume( { media: mockMedia } )
			)

			act( () => {
				result.current.setVolume( 0 )
			} )

			expect( mockMedia.muted ).toBe( true )

		} )
		
		
		it( 'unmutes the media when setting volume > 0', () => {

			mockMedia.muted = true

			const { result } = renderHook(
				() => useVolume( { media: mockMedia } )
			)

			act( () => {
				result.current.setVolume( 0.5 )
			} )

			expect( mockMedia.muted ).toBe( false )

		} )

	} )


	describe( 'toggleMute', () => {

		it( 'returns 0 when muting', () => {

			const { result } = renderHook( () =>
				useVolume( { volume: 0.8, media: mockMedia } )
			)

			let returnValue: number | undefined

			act( () => {
				returnValue = result.current.toggleMute()
			} )

			expect( returnValue ).toBe( 0 )
			expect( mockMedia.muted ).toBe( true )

		} )


		it( 'unmutes media and restores volume when unmuting', () => {

			const { result } = renderHook( () => (
				useVolume( { volume: 0.8, media: mockMedia } )
			) )

			act( () => {
				result.current.toggleMute()
				expect( mockMedia.muted ).toBe( true )
			} )

			act( () => {
				const returnValue = result.current.toggleMute()
				expect( returnValue ).toBe( 0.8 )
			} )
			
			expect( mockMedia.muted ).toBe( false )

			expect( result.current.volumeRef.current )
				.toBe( AudioEngine.normalize( 0.8 ) )

		} )


		it( 'calls fadeVolume when toggling mute', () => {

			const { result } = renderHook( () => (
				useVolume( { media: mockMedia, fade: 300 } )
			) )

			act( () => {
				result.current.toggleMute()
			} )

			expect( fadeVolume ).toHaveBeenCalled()

		} )


		it( 'updates internal refs only when no media is given', () => {

			const { result } = renderHook( () => useVolume( { volume: 0.7 } ) )

			act( () => {
				result.current.setVolume( 0.5 )
			} )

			expect( result.current.volumeRef.current )
				.toBe( AudioEngine.normalize( 0.5 ) )

			act( () => {
				expect( result.current.toggleMute() ).toBe( 0 )
			} )
			
			expect( result.current.volumeRef.current ).toBe( 0 )

		} )

	} )

} )