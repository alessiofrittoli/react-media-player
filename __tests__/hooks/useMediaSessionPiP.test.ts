import { renderHook } from '@testing-library/react'
import { useMediaSessionPiP } from '@/hooks/useMediaSessionPiP'


describe( 'useMediaSessionPiP', () => {

	let originalMediaSession: MediaSession
	let setActionHandler: jest.Mock
	let warnSpy: jest.SpyInstance

	beforeEach( () => {

		originalMediaSession = navigator.mediaSession

		setActionHandler = jest.fn()

		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: {
				setActionHandler,
			},
		} )

		warnSpy = jest.spyOn( console, 'warn' ).mockImplementation( () => {} )

	} )


	afterEach( () => {

		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: originalMediaSession,
		} )

		warnSpy.mockRestore()
		jest.clearAllMocks()

	} )


	it( 'does nothing when register is false', () => {

		const onEnterPiP = jest.fn()

		renderHook( () => (
			useMediaSessionPiP( { register: false, onEnterPiP } )
		) )

		expect( setActionHandler ).not.toHaveBeenCalled()

	} )


	it( 'registers the enterpictureinpicture handler when enabled', () => {

		const onEnterPiP = jest.fn()

		renderHook( () => (
			useMediaSessionPiP( { register: true, onEnterPiP } )
		) )

		expect( setActionHandler )
			.toHaveBeenCalledWith( 'enterpictureinpicture', onEnterPiP )

	} )


	it( 'warns when enterpictureinpicture action is unsupported', () => {

		setActionHandler.mockImplementation( () => {
			throw new Error( 'unsupported' )
		} )

		const onEnterPiP = jest.fn()

		renderHook( () => (
			useMediaSessionPiP( { register: true, onEnterPiP } )
		) )

		expect( warnSpy ).toHaveBeenCalledWith(
			'Warning! The "enterpictureinpicture" media session action is not supported.',
			expect.any( Error )
		)

	} )

} )
