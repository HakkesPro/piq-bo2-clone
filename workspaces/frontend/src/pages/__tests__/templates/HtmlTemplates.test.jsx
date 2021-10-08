import { render, prettyDOM } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { Suspense } from 'react'
import HtmlTemplates from '../../templates/HtmlTemplates'

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
*/

/*
  Template view files all use the GenericTemplate component and generally don't contain
  any unique render logic or other logic. We test out that each template view renders without
  errors and do a snapshot test to see that nothing has changed.
*/

jest.mock('redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (callback) => {
    return callback({
      metadataReducer: {
        roles: require('../../../../test/unit/mockdata').roles
      },
      contextReducer: {
        activePage: 'HOME',
        showDesktopSidebar: true
      }
    })
  }
}))

const content = () => (
  <Suspense fallback={<div>Fallback</div>}>
    <HtmlTemplates
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

// Snapshot testing - does the rendered output match the saved snapshot?
test('Renders an empty div by default from GenericTemplate', () => {
  render(content())
  expect(prettyDOM(document.body)).toMatchSnapshot()
})
