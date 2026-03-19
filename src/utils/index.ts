import type { Queue } from '@/types'
import type { NewQueue, QueuedItemType } from '@alessiofrittoli/react-hooks/queue'

export {
	addItemUUID,
	addItemsUUID,
	maybeAddItemUUID,
	maybeAddItemsUUID,
	findIndexByUUID,
} from '@alessiofrittoli/react-hooks/queue/utils'


/**
 * Inherit metadata fields from a queue into a queued item payload.
 * 
 * Please note that the given item fields takes precedence over queue fields.
 * 
 * Inherited properties are listed below:
 * 
 * - album			| The album name of the media.
 * - artist			| The artist of the media.
 * - artwork		| The media artwork.
 * - videoArtwork	| The media video artwork.
 * 
 * @param item	The queued item.
 * @param queue	The queue from which the fields are inherited.
 * 
 * @returns The queued item with intherited fileds from the given `queue`.
 */
export const inheritDataFromQueue = <
	T extends Queue = Queue
>( item: QueuedItemType<T>, { album, artist, artwork, videoArtwork }: T | NewQueue<T> ): QueuedItemType<T> => ( {
	album, artist, artwork, videoArtwork, ...item,
} )
