import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { Suspense } from 'react'
import Fallback3ds2 from '../Fallback3ds2'

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
*/

const content = () => (
  <Suspense fallback={<div>Fallback</div>}>
    <Fallback3ds2
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
