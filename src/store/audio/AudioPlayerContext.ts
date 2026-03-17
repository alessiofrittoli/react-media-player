import { createContext } from 'react'
import type { UseMediaPlayer } from '@/hooks/useMediaPlayer'

export const AudioPlayerContext = createContext<UseMediaPlayer | undefined>( undefined )

AudioPlayerContext.displayName = 'AudioPlayerContext'