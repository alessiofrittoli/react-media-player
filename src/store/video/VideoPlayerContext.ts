import { createContext } from 'react'
import { UseVideoPlayer } from '@/hooks/useVideoPlayer'

export const VideoPlayerContext = createContext<UseVideoPlayer | undefined>( undefined )

VideoPlayerContext.displayName = 'VideoPlayerContext'