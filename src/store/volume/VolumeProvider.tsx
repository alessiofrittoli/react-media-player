'use client'

import { VolumeContext } from '@/store/volume/VolumeContext'
import { useState } from 'react'

export type VolumeProviderProps = React.PropsWithChildren<{
	/**
	 * The master volume [0-1].
	 *
	 * @default 1
	 */
	volume?: number
}>

export const VolumeProvider: React.FC<VolumeProviderProps> = ({ volume: initialVolume = 1, children }) => {
	const [volume, setVolume] = useState(initialVolume)

	return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>
}
