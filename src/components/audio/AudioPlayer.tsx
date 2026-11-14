import { AudioPlayerProvider } from '@/store/audio/AudioPlayerProvider'
import type { UseAudioPlayerOptions } from '@/hooks/useAudioPlayer'
import { VolumeProvider } from '@/store/volume/VolumeProvider'

export type AudioPlayerProps = React.PropsWithChildren<UseAudioPlayerOptions>

/**
 * The official AudioPlayer.
 *
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ children, ...options }) => (
	<AudioPlayerProvider {...options}>
		<VolumeProvider volume={options.volume}>{children}</VolumeProvider>
	</AudioPlayerProvider>
)
