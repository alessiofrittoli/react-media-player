import { render, renderHook } from '@testing-library/react'
import { VideoPlayerContext } from '@/store/video/VideoPlayerContext'
import { VideoPlayerProvider } from '@/store/video/VideoPlayerProvider'
import { useVideoPlayerStore } from '@/store/video/useVideoPlayerStore'
import { addItemsUUID } from '@/utils'
import type { Media, Queue } from '@/types'


const queue: Queue = {
	items: addItemsUUID<Media>( [
		{ src: '/video.mp4', type: 'video', title: 'Test video' },
	] )
}


describe( 'Video player store', () => {

	it( 'exposes a stable display name for the context', () => {
		expect( VideoPlayerContext.displayName )
			.toBe( 'VideoPlayerContext' )
	} )


	it( 'throws when used outside the provider', () => {

		expect( () => renderHook( () => useVideoPlayerStore() ) )
			.toThrow(
				'useVideoPlayerStore has been called outside VideoPlayer Context Provider. ' +
				'Please make sure to wrap your components with the VideoPlayer Component.'
			)
		
	} )


	it( 'provides a store from the provider', () => {
		const wrapper: React.FC<React.PropsWithChildren> = ( { children } ) => (
			<VideoPlayerProvider queue={ queue }>
				{ children }
			</VideoPlayerProvider>
		)

		const { result } = renderHook( () => useVideoPlayerStore(), { wrapper } )

		expect( result.current.videoRef ).toBeDefined()
		expect( result.current.initialVolume ).toBe( 1 )
	} )


	it( 'respects initial volume from provider prop', () => {
		render(
			<VideoPlayerProvider queue={ queue } volume={ 0.7 }>
				<VideoPlayerContext.Consumer>
					{ ( value ) => <span>{ value?.initialVolume }</span> }
				</VideoPlayerContext.Consumer>
			</VideoPlayerProvider>
		)

		expect( document.body.textContent ).toBe( '0.7' )
	} )

} )
