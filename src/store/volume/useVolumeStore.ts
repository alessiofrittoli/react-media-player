import { VolumeContext, type VolumeCtx } from '@/store/volume/VolumeContext'
import { useContext } from 'react'

export const useVolumeStore = (): VolumeCtx => {
	const result = useContext(VolumeContext)

	if (!result) {
		throw new Error(
			'useVolumeStore has been called outside Volume Context Provider. ' +
				'Please make sure to wrap your components with the Volume Component.',
		)
	}

	return result
}
