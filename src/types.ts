import type { Media as GlobalMedia } from '@alessiofrittoli/media-utils'
import type { QueuedItem, QueueItem, Queue as GlobalQueue } from '@alessiofrittoli/react-hooks/queue'


export interface FadeSettings
{
	/**
	 * Fade-in duration in milliseconds.
	 * 
	 */
	in?: number
	/**
	 * Fade-out duration in milliseconds.
	 * 
	 */
	out?: number
}


/**
 * Defines the media.
 * 
 */
export interface Media extends GlobalMedia
{
	/**
	 * The media volume fade options.
	 * 
	 */
	fade?: FadeSettings
	/**
	 * The media fade markers.
	 * 
	 * Indicates at which time in seconds the fade should be applied.
	 */
	fadeCuePoints?: FadeSettings
}


export type QueueMedia<T extends Media = Media> = QueueItem<T>
export type QueuedMedia<T extends Media = Media> = QueuedItem<T>
export type QueuedMedias<T extends Media = Media> = QueuedMedia<T>[]


/**
 * Defines the queue.
 * 
 */
export type Queue<T extends Media = Media> = GlobalQueue<T>


/**
 * Defines a bookmarked item to restore from the queue.
 * 
 */
export type Bookmark<T extends Media = Media> = QueuedMedia<T> &
{
	/**
	 * Defines the bookmarked media time.
	 * 
	 */
	time?: number
}