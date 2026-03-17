import { render } from '@testing-library/react'
import { createRef } from 'react'
import type { RefObject } from 'react'


let videoRef: RefObject<HTMLVideoElement | null>

jest.mock( '@/store/video/useVideoPlayerStore', () => ( {
	useVideoPlayerStore: () => ( { videoRef } )
} ) )

import { HTMLVideoPlayer } from '@/components/video/HTMLVideoPlayer'


describe( 'HTMLVideoPlayer', () => {

	beforeEach( () => {
		videoRef = createRef<HTMLVideoElement>()
	} )


	it( 'renders a video element with the provided className', () => {
		const { container } = render( <HTMLVideoPlayer className='my-video' /> )

		const video = container.querySelector( 'video' )

		expect( video ).not.toBeNull()
		expect( video?.className ).toBe( 'my-video' )
	} )


	it( 'assigns the store videoRef to the rendered element', () => {
		const { container } = render( <HTMLVideoPlayer /> )

		const video = container.querySelector( 'video' )

		expect( videoRef.current ).toBe( video )
	} )

} )
