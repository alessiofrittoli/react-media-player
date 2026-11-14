import type { UseVideoPlayer } from '@/hooks/useVideoPlayer'
import { createContext } from 'react'

export const VideoPlayerContext = createContext<UseVideoPlayer | undefined>(undefined)

VideoPlayerContext.displayName = 'VideoPlayerContext'
