import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { Queue } from '@/types'


let audioProviderProps: Record<string, unknown> | undefined
let volumeProviderProps: Record<string, unknown> | undefined

jest.mock( '@/store/audio/AudioPlayerProvider', () => ( {
	AudioPlayerProvider: ( { children, ...props }: { children: ReactNode } ) => {
		audioProviderProps = props
		return <div data-testid='audio-provider'>{ children }</div>
	}
} ) )

jest.mock( '@/store/volume/VolumeProvider', () => ( {
	VolumeProvider: ( { children, ...props }: { children: ReactNode } ) => {
		volumeProviderProps = props
		return <div data-testid='volume-provider'>{ children }</div>
	}
} ) )

import { AudioPlayer } from '@/components/audio/AudioPlayer'


describe( 'AudioPlayer', () => {

	beforeEach( () => {
		audioProviderProps = undefined
		volumeProviderProps = undefined
	} )


	it( 'passes options to providers and renders children', () => {
		const queue = { items: [] } as unknown as Queue

		render(
			<AudioPlayer queue={ queue } volume={ 0.4 } preload={ false }>
				<span data-testid='child'>Child</span>
			</AudioPlayer>
		)

		expect( screen.getByTestId( 'child' ).textContent ).toBe( 'Child' )
		expect( audioProviderProps?.queue ).toBe( queue )
		expect( audioProviderProps?.volume ).toBe( 0.4 )
		expect( audioProviderProps?.preload ).toBe( false )
		expect( volumeProviderProps?.volume ).toBe( 0.4 )
	} )

} )
