import { HTMLVideoPlayer } from '@/components/video/HTMLVideoPlayer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import type { RefObject } from 'react'
import { createRef } from 'react'

let videoRef: RefObject<HTMLVideoElement | null>

vi.mock('@/store/video/useVideoPlayerStore', () => ({
	useVideoPlayerStore: () => ({ videoRef }),
}))

describe('HTMLVideoPlayer', () => {
	beforeEach(() => {
		videoRef = createRef<HTMLVideoElement>()
	})

	it('renders a video element with the provided className', () => {
		const { container } = render(<HTMLVideoPlayer className='my-video' />)

		const video = container.querySelector('video')

		expect(video).not.toBeNull()
		expect(video?.className).toBe('my-video')
	})

	it('assigns the store videoRef to the rendered element', () => {
		const { container } = render(<HTMLVideoPlayer />)

		const video = container.querySelector('video')

		expect(videoRef.current).toBe(video)
	})
})
