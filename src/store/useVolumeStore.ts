import { useContext } from 'react'
import { VolumeContext } from '@/store/VolumeContext'

export const useVolumeStore = () => {

	const result = useContext( VolumeContext )

	if ( ! result ) {
		throw new Error(
			'useVolumeStore has been called outside Volume Context Provider. ' +
			'Please make sure to wrap your components with the Volume Component.'
		)
	}

	return result
	
}