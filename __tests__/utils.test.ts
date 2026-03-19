import { Queue } from '@/types'
import * as utils from '@/utils'
import { QueuedItemType } from '@alessiofrittoli/react-hooks/queue'

describe( 'utils', () => {

	describe( '@alessiofrittoli/react-hooks/queue/utils', () => {

		it( 'exports module functions', () => {
	
			expect( utils.addItemUUID ).toBeInstanceOf( Function )
			expect( utils.addItemsUUID ).toBeInstanceOf( Function )
			expect( utils.maybeAddItemUUID ).toBeInstanceOf( Function )
			expect( utils.maybeAddItemsUUID ).toBeInstanceOf( Function )
			expect( utils.findIndexByUUID ).toBeInstanceOf( Function )
	
		} )

	} )

	describe( 'inheritDataFromQueue', () => {

		it( 'inherits metadata from queue when item is missing fields', () => {
	
			const item = {
				uuid	: 'item-1',
				title	: 'Track 1',
			} as unknown as QueuedItemType<Queue>
	
			const queue = {
				album			: 'Album A',
				artist			: 'Artist A',
				artwork			: 'artwork-a.jpg',
				videoArtwork	: 'video-a.jpg',
			} as unknown as Queue
	
			const result = utils.inheritDataFromQueue( item, queue )
	
			expect( result ).toEqual( {
				uuid			: 'item-1',
				title			: 'Track 1',
				album			: 'Album A',
				artist			: 'Artist A',
				artwork			: 'artwork-a.jpg',
				videoArtwork	: 'video-a.jpg',
			} )
	
		} )
	

		it( 'keeps item metadata when provided', () => {

			const item = {
				uuid			: 'item-1',
				title			: 'Track 1',
				album			: 'Album B',
				artist			: 'Artist B',
				artwork			: 'artwork-b.jpg',
				videoArtwork	: 'video-b.jpg',
			} as unknown as QueuedItemType<Queue>
	
			const queue = {
				album			: 'Album Q',
				artist			: 'Artist Q',
				artwork			: 'artwork-q.jpg',
				videoArtwork	: 'video-q.jpg',
			} as unknown as Queue
	
			const result = utils.inheritDataFromQueue( item, queue )
	
			expect( result ).toEqual( item )
	
		} )

	} )


} )
