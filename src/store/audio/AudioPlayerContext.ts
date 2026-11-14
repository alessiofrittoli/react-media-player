import type { UseMediaPlayer } from '@/hooks/useMediaPlayer'
import { createContext } from 'react'

export const AudioPlayerContext = createContext<UseMediaPlayer | undefined>(undefined)

AudioPlayerContext.displayName = 'AudioPlayerContext'
