import { render, renderHook, act } from '@testing-library/react'
import { VolumeContext } from '@/store/volume/VolumeContext'
import { VolumeProvider } from '@/store/volume/VolumeProvider'
import { useVolumeStore } from '@/store/volume/useVolumeStore'


describe( 'Volume store', () => {

	it( 'exposes a stable display name for the context', () => {
		expect( VolumeContext.displayName )
			.toBe( 'VolumeContext' )
	} )


	it( 'throws when used outside the provider', () => {

		expect( () => renderHook( () => useVolumeStore() ) )
			.toThrow(
				'useVolumeStore has been called outside Volume Context Provider. ' +
				'Please make sure to wrap your components with the Volume Component.'
			)
		
	} )


	it( 'provides default volume and updates via setVolume', () => {
		const wrapper: React.FC<React.PropsWithChildren> = ( { children } ) => (
			<VolumeProvider>
				{ children }
			</VolumeProvider>
		)

		const { result } = renderHook( () => useVolumeStore(), { wrapper } )

		expect( result.current.volume ).toBe( 1 )

		act( () => {
			result.current.setVolume( 0.4 )
		} )

		expect( result.current.volume ).toBe( 0.4 )
	} )


	it( 'respects initial volume from provider prop', () => {
		render(
			<VolumeProvider volume={ 0.7 }>
				<VolumeContext.Consumer>
					{ ( value ) => <span>{ value?.volume }</span> }
				</VolumeContext.Consumer>
			</VolumeProvider>
		)

		expect( document.body.textContent ).toBe( '0.7' )
	} )

} )
