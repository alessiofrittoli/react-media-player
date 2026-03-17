import { act, renderHook } from '@testing-library/react'
import { useEventListener as _useEventListener } from '@alessiofrittoli/react-hooks'

import { useMediaPlayer } from '@/hooks/useMediaPlayer'
import {
	type UseVolume,
	useVolume as _useVolume,
} from '@/hooks/useVolume'
import {
	PlayerState,
	type UseMediaPlayerController,
	useMediaPlayerController as _useMediaPlayerController,
} from '@/hooks/useMediaPlayerController'
import { useMediaPlayerLoading as _useMediaPlayerLoading } from '@/hooks/useMediaPlayerLoading'
import {
	type UseMediaPreload,
	useMediaPreload as _useMediaPreload,
} from '@/hooks/useMediaPreload'
import { useMediaSession as _useMediaSession } from '@/hooks/useMediaSession'
import type { Queue } from '@/types'


jest.mock( '@alessiofrittoli/react-hooks', () => ( {
	...jest.requireActual( '@alessiofrittoli/react-hooks' ),
	useEventListener: jest.fn<ReturnType<typeof _useEventListener>, Parameters<typeof _useEventListener>>(),
} ) )

jest.mock( '@/hooks/useMediaSession', () => ( {
	useMediaSession: jest.fn(),
} ) )

jest.mock( '@/hooks/useVolume', () => ( {
	useVolume: jest.fn(),
} ) )

jest.mock( '@/hooks/useMediaPreload', () => ( {
	useMediaPreload: jest.fn(),
} ) )

jest.mock( '@/hooks/useMediaPlayerLoading', () => ( {
	useMediaPlayerLoading: jest.fn(),
} ) )

jest.mock( '@/hooks/useMediaPlayerController', () => ( {
	...jest.requireActual( '@/hooks/useMediaPlayerController' ),
	useMediaPlayerController: jest.fn(),
} ) )


const useEventListener = (
	_useEventListener
) as unknown as jest.Mock<ReturnType<typeof _useEventListener>, Parameters<typeof _useEventListener>>

const useMediaSession = (
	_useMediaSession
) as jest.Mock<ReturnType<typeof _useMediaSession>, Parameters<typeof _useMediaSession>>

const useVolume = (
	_useVolume
) as jest.Mock<ReturnType<typeof _useVolume>, Parameters<typeof _useVolume>>

const useMediaPreload = (
	_useMediaPreload
) as jest.Mock<ReturnType<typeof _useMediaPreload>, Parameters<typeof _useMediaPreload>>

const useMediaPlayerLoading = (
	_useMediaPlayerLoading
) as jest.Mock<ReturnType<typeof _useMediaPlayerLoading>, Parameters<typeof _useMediaPlayerLoading>>

const useMediaPlayerController = (
	_useMediaPlayerController
) as jest.Mock<ReturnType<typeof _useMediaPlayerController>, Parameters<typeof _useMediaPlayerController>>


type MockMediaElement = HTMLMediaElement & {
	duration	: number
	currentTime	: number
}


describe( 'useMediaPlayer', () => {

	let mockMedia: MockMediaElement
	let queue: Queue

	const volumeController = {
		volumeRef	: { current: 0 },
		volume		: 0,
		setVolume	: jest.fn(),
	}

	const preloadController = {
		preloadMedia		: jest.fn(),
		preloadPreviousMedia: jest.fn(),
		preloadNextMedia	: jest.fn(),
	}

	const loadingController = {
		isLoading	: false,
		error		: undefined,
	}

	const controller = {
		state				: PlayerState.PLAYING,
		hasNext				: true,
		hasPrevious			: true,
		togglePlayPause		: jest.fn(),
		stop				: jest.fn(),
		previous			: jest.fn(),
		next				: jest.fn(),
	}

	beforeEach( () => {

		mockMedia = {
			duration	: 120,
			currentTime	: 0,
		} as MockMediaElement

		queue = { items: [] } as unknown as Queue

		jest.clearAllMocks()

		useVolume.mockReturnValue( volumeController as unknown as UseVolume )
		useMediaPlayerController.mockReturnValue( controller as unknown as UseMediaPlayerController )
		useMediaPreload.mockReturnValue( preloadController as unknown as UseMediaPreload )
		useMediaPlayerLoading.mockReturnValue( loadingController )

	} )


	const getListener = ( event: string ) => {
		const call = useEventListener.mock.calls.find( ( [ name ] ) => name === event )
		if ( ! call ) throw new Error( `useEventListener was not called for ${ event }` )
		return call[ 1 ].listener as () => void
	}

	const getTarget = ( event: string ) => {
		const call = useEventListener.mock.calls.find( ( [ name ] ) => name === event )
		if ( ! call ) throw new Error( `useEventListener was not called for ${ event }` )
		return call[ 1 ].target
	}


	it( 'wires controllers and registers media session', () => {

		const options = {
			queue,
			media					: mockMedia,
			volume					: 0.7,
			normalizeVolume			: true,
			playPauseFadeDuration	: 150,
			preload					: true,
		}

		const { result } = renderHook( () => useMediaPlayer( options ) )

		expect( useVolume ).toHaveBeenCalledWith( {
			media			: mockMedia,
			volume			: 0.7,
			fade			: 150,
			normalizeVolume	: true,
		} )

		expect( useMediaPlayerController ).toHaveBeenCalledWith( {
			...options,
			volumeRef: volumeController.volumeRef,
		} )

		expect( useMediaSession ).toHaveBeenCalledWith( {
			media	: mockMedia,
			register: true,
			onPlay	: controller.togglePlayPause,
			onPause	: controller.togglePlayPause,
			onStop	: controller.stop,
			onPrev	: controller.previous,
			onNext	: controller.next,
		} )

		expect( useEventListener ).toHaveBeenCalledTimes( 2 )
		expect( getTarget( 'canplaythrough' ) ).toBe( mockMedia )
		expect( getTarget( 'timeupdate' ) ).toBe( mockMedia )

		expect( result.current.media ).toBe( mockMedia )
		expect( result.current.state ).toBe( controller.state )
		expect( result.current.hasNext ).toBe( controller.hasNext )
		expect( result.current.hasPrevious ).toBe( controller.hasPrevious )
		expect( result.current.togglePlayPause ).toBe( controller.togglePlayPause )
		expect( result.current.stop ).toBe( controller.stop )
		expect( result.current.previous ).toBe( controller.previous )
		expect( result.current.next ).toBe( controller.next )
		
		expect( result.current.volumeRef ).toBe( volumeController.volumeRef )
		expect( result.current.setVolume ).toBe( volumeController.setVolume )

		expect( result.current.preloadMedia ).toBe( preloadController.preloadMedia )
		expect( result.current.preloadPreviousMedia ).toBe( preloadController.preloadPreviousMedia )
		expect( result.current.preloadNextMedia ).toBe( preloadController.preloadNextMedia )
		
		expect( result.current.isLoading ).toBe( loadingController.isLoading )
		expect( result.current.error ).toBe( loadingController.error )

	} )


	it( 'preloads on canplaythrough and timeupdate when close to end', () => {

		renderHook( () => useMediaPlayer( { queue, media: mockMedia, preload: true } ) )

		const canPlayListener = getListener( 'canplaythrough' )
		const timeUpdateListener = getListener( 'timeupdate' )

		act( () => {
			canPlayListener()
		} )

		expect( preloadController.preloadNextMedia ).toHaveBeenCalledTimes( 1 )

		mockMedia.currentTime = 95
		act( () => {
			timeUpdateListener()
		} )

		expect( preloadController.preloadNextMedia ).toHaveBeenCalledTimes( 2 )

		mockMedia.currentTime = 70
		act( () => {
			timeUpdateListener()
		} )

		expect( preloadController.preloadNextMedia ).toHaveBeenCalledTimes( 2 )

	} )


	it( 'skips preloading when preload is disabled', () => {

		renderHook( () => useMediaPlayer( { queue, media: mockMedia, preload: false } ) )

		expect( getTarget( 'canplaythrough' ) ).toBeUndefined()
		expect( getTarget( 'timeupdate' ) ).toBeUndefined()

		act( () => {
			getListener( 'canplaythrough' )()
			getListener( 'timeupdate' )()
		} )

		expect( preloadController.preloadNextMedia ).not.toHaveBeenCalled()

	} )


	it( 'skips preloading when media is missing', () => {

		renderHook( () => useMediaPlayer( { queue, preload: true } ) )

		act( () => {
			getListener( 'canplaythrough' )()
			getListener( 'timeupdate' )()
		} )

		expect( preloadController.preloadNextMedia ).not.toHaveBeenCalled()

	} )


	it( 'skips preloading when there is no next media and unregisters media session', () => {

		useMediaPlayerController.mockReturnValue( {
			...controller,
			state		: PlayerState.STOPPED,
			hasNext		: false,
			hasPrevious	: false,
		} as unknown as UseMediaPlayerController )

		renderHook( () => useMediaPlayer( { queue, media: mockMedia } ) )

		act( () => {
			getListener( 'canplaythrough' )()
			getListener( 'timeupdate' )()
		} )

		expect( preloadController.preloadNextMedia ).not.toHaveBeenCalled()

		expect( useMediaSession ).toHaveBeenCalledWith( {
			media: mockMedia,
			register: false,
			onPlay	: controller.togglePlayPause,
			onPause	: controller.togglePlayPause,
			onStop	: controller.stop,
			onPrev	: undefined,
			onNext	: undefined,
		} )

	} )

} )
