import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { Suspense } from 'react'
import Investigate from '../Investigate'

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
*/

const content = () => (
  <Suspense fallback={<div>Fallback</div>}>
    <Investigate
      setShowLegacy={(boo) => { /* return nothing */ }}
    />
  </Suspense>
)

test('Renders the component without throwing error', () => {
  render(
    <Provider store={store}>
      { content() }
    </Provider>
  )
})
