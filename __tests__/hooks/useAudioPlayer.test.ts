/**
 * @jest-environment node
 */

import { useRef as _useRef } from 'react'

import type { Queue } from '@/types'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { useMediaPlayer as _useMediaPlayer, type UseMediaPlayer } from '@/hooks/useMediaPlayer'


jest.mock( 'react', () => ( {
	useRef: jest.fn(),
} ) )

jest.mock( '@/hooks/useMediaPlayer', () => ( {
	useMediaPlayer: jest.fn(),
} ) )


const useRef = _useRef as jest.Mock<ReturnType<typeof _useRef>, Parameters<typeof _useRef>>
const useMediaPlayer = _useMediaPlayer as jest.Mock<ReturnType<typeof _useMediaPlayer>, Parameters<typeof _useMediaPlayer>>


describe( 'useAudioPlayer', () => {

	const originalAudio = globalThis.Audio

	beforeEach( () => {
		jest.clearAllMocks()
	} )

	afterEach( () => {
		jest.clearAllMocks()
		globalThis.Audio = originalAudio
	} )

	
	it( 'uses Audio when window is available', () => {

		class MockAudio {}

		globalThis.Audio = MockAudio as typeof Audio

		Object.defineProperty( global, 'window', {
			configurable	: true,
			value			: {}
		} )

		const refCurrent = { tag: 'ref' }
		useRef.mockReturnValue( { current: refCurrent } )

		const options = { queue: { items: [] } as Queue }
		const player = { tag: 'player' } as unknown as UseMediaPlayer
		useMediaPlayer.mockReturnValue( player )

		const result = useAudioPlayer( options )

		expect( useRef ).toHaveBeenCalledTimes( 1 )
		expect( useRef.mock.calls[ 0 ]?.[ 0 ] ).toBeInstanceOf( MockAudio )
		expect( useMediaPlayer ).toHaveBeenCalledWith( { media: refCurrent, ...options } )
		expect( result ).toBe( player )

		Object.defineProperty( global, 'window', {
			configurable	: true,
			value			: undefined,
		} )

	} )


	it( 'uses undefined media when window is not available', () => {


		Object.defineProperty( global, 'window', {
			configurable	: true,
			value			: undefined,
		} )
		

		const refCurrent = { tag: 'ref' }
		useRef.mockReturnValue( { current: refCurrent } )

		const options = { queue: { items: [] } as Queue }
		const player = { tag: 'player' } as unknown as UseMediaPlayer
		useMediaPlayer.mockReturnValue( player )

		useAudioPlayer( options )

		expect( useRef ).toHaveBeenCalledTimes( 1 )
		expect( useRef.mock.calls[ 0 ]?.[ 0 ] ).toBeUndefined()
		expect( useMediaPlayer ).toHaveBeenCalledWith( { media: refCurrent, ...options } )

	} )

} )
