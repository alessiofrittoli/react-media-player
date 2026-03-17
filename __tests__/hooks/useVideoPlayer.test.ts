import { useRef as _useRef } from 'react'
import { renderHook } from '@testing-library/react'

import type { Queue } from '@/types'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { useMediaPlayer as _useMediaPlayer } from '@/hooks/useMediaPlayer'


jest.mock( 'react', () => ( {
	...jest.requireActual( 'react' ),
	useRef: jest.fn( value => ( { current: value } ) ),
} ) )


jest.mock( '@/hooks/useMediaPlayer', () => ( {
	useMediaPlayer: jest.fn(),
} ) )


const useRef = _useRef as jest.Mock<ReturnType<typeof _useRef>, Parameters<typeof _useRef>>
const useMediaPlayer = _useMediaPlayer as jest.Mock<ReturnType<typeof _useMediaPlayer>, Parameters<typeof _useMediaPlayer>>


describe( 'useVideoPlayer', () => {

	beforeEach( () => {
		jest.clearAllMocks()
	} )


	it( 'passes undefined media until the ref is set', () => {

		const options		= { queue: { items: [] } as Queue }
		const { result }	= renderHook( () => useVideoPlayer( options ) )

		expect( result.current.videoRef.current ).toBeNull()
		expect( useMediaPlayer ).toHaveBeenCalledTimes( 1 )
		expect( useMediaPlayer ).toHaveBeenCalledWith( { media: undefined, ...options } )

	} )


	it( 'sets media when the ref becomes available', async () => {

		useRef.mockReturnValueOnce( { current: document.createElement( 'video' ) } )

		const options = { queue: { items: [] } as Queue }

		const { result } = renderHook( () => useVideoPlayer( options ) )

		expect( result.current.videoRef.current )
			.toBeInstanceOf( HTMLVideoElement )

	} )

} )
