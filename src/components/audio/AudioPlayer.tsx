import { AudioPlayerProvider } from '@/store/audio/AudioPlayerProvider'
import { VolumeProvider } from '@/store/volume/VolumeProvider'
import type { UseAudioPlayerOptions } from '@/hooks/useAudioPlayer'


export type AudioPlayerProps = React.PropsWithChildren<UseAudioPlayerOptions>


/**
 * The official AudioPlayer.
 * 
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ( { children, ...options } ) => (
	<AudioPlayerProvider { ...options }>
		<VolumeProvider volume={ options.volume }>
			{ children }
		</VolumeProvider>
	</AudioPlayerProvider>
)