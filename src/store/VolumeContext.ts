import { createContext } from 'react'


export interface VolumeCtx
{
	volume: number
	setVolume: React.Dispatch<React.SetStateAction<number>>
}


export const VolumeContext = createContext<VolumeCtx | undefined>( undefined )

VolumeContext.displayName = 'VolumeContext'