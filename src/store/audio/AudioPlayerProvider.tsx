'use client'

import { useAudioPlayer, type UseAudioPlayerOptions } from '@/hooks/useAudioPlayer'
import { AudioPlayerContext } from '@/store/audio/AudioPlayerContext'


export type AudioPlayerProviderProps = React.PropsWithChildren<UseAudioPlayerOptions>


export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ( { children, ...options } ) => (
	<AudioPlayerContext.Provider value={ useAudioPlayer( options ) }>
		{ children }
	</AudioPlayerContext.Provider>
)