const path = require('path')

// Should be completely aligned to the left, otherwise there will be whitespaces in the output.
const testPageTemplate = (name) => 
`import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { Suspense } from 'react'
import ${name} from '../${name}'

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
*/

const content = () => (
  <Suspense fallback={<div>Fallback</div>}>
    <${name}
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
`

exports.createTestPageTemplate = (create, name) => {
  const pathDestination = path.join(__dirname, '../../src/pages/__tests__')
  create(pathDestination, testPageTemplate(name))
}
