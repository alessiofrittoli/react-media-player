import type { HTMLVideoPlayerProps } from '@/components/video/HTMLVideoPlayer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { Queue } from '@/types'

let videoProviderProps: Record<string, unknown> | undefined
let volumeProviderProps: Record<string, unknown> | undefined
let htmlVideoProps: HTMLVideoPlayerProps | undefined

vi.mock('@/store/video/VideoPlayerProvider', () => ({
	VideoPlayerProvider: ({ children, ...props }: { children: ReactNode }) => {
		videoProviderProps = props
		return <div data-testid='video-provider'>{children}</div>
	},
}))

vi.mock('@/store/volume/VolumeProvider', () => ({
	VolumeProvider: ({ children, ...props }: { children: ReactNode }) => {
		volumeProviderProps = props
		return <div data-testid='volume-provider'>{children}</div>
	},
}))

vi.mock('@/components/video/HTMLVideoPlayer', () => ({
	HTMLVideoPlayer: (props: HTMLVideoPlayerProps) => {
		htmlVideoProps = props
		return <div data-testid='html-video' />
	},
}))

describe('VideoPlayer', () => {
	beforeEach(() => {
		videoProviderProps = undefined
		volumeProviderProps = undefined
		htmlVideoProps = undefined
	})

	it('passes options to providers, forwards html props, and renders children', () => {
		const queue = { items: [] } as unknown as Queue

		render(
			<VideoPlayer queue={queue} volume={0.65} preload={false} htmlProps={{ className: 'my-video' }}>
				<span data-testid='child'>Child</span>
			</VideoPlayer>,
		)

		expect(screen.getByTestId('child').textContent).toBe('Child')
		expect(videoProviderProps?.queue).toBe(queue)
		expect(videoProviderProps?.volume).toBe(0.65)
		expect(videoProviderProps?.preload).toBe(false)
		expect(volumeProviderProps?.volume).toBe(0.65)
		expect(htmlVideoProps?.className).toBe('my-video')
	})
})
