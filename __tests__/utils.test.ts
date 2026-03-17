import * as utils from '@/utils'

describe( 'utils', () => {

	it( 'exports @alessiofrittoli/react-hooks/queue/utils module functions', async () => {

		expect( utils.addItemUUID ).toBeInstanceOf( Function )
		expect( utils.addItemsUUID ).toBeInstanceOf( Function )
		expect( utils.maybeAddItemUUID ).toBeInstanceOf( Function )
		expect( utils.maybeAddItemsUUID ).toBeInstanceOf( Function )
		expect( utils.findIndexByUUID ).toBeInstanceOf( Function )

	} )

} )