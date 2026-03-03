import '@testing-library/jest-dom'
import { render, screen, renderHook } from '@testing-library/react'


describe( 'Jest', () => {

	it( 'runs with jest-environment-jsdom', () => {
	
		expect( window ).not.toBeUndefined()
	
	} )


	it( 'can test React Components', () => {

		render( <div data-testid='test'>Hello</div> )

		expect( screen.queryByTestId( 'test' ) )
			.toBeInTheDocument()

	} )
	
	
	it( 'can test React hooks', () => {

		const useSomeHook = () => true

		const { result } = renderHook( () => useSomeHook() )

		expect( result.current )
			.toBeTruthy()

	} )
	
} )