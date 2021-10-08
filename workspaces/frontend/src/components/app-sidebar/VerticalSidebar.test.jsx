import { render, screen, fireEvent, prettyDOM } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import VerticalSidebar from './VerticalSidebar'
import { getMenuItems } from 'utils/menu-items'

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
*/

const mockDispatch = jest.fn()
jest.mock('redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (callback) => {
    return callback({
      metadataReducer: {
        roles: require('../../../test/unit/mockdata').roles
      },
      contextReducer: {
        activePage: 'ADMIN_TEMPLATES_HTML', // default to Html templates
        showDesktopSidebar: true
      }
    })
  }
}))

const menuItemsFlattened = getMenuItems()

const content = () => (
  <Router>
    <Provider store={store}>
      <VerticalSidebar />
    </Provider>
  </Router>
)

test('Renders the component without throwing error', () => {
  render(content())
})

test('Marks HTML Templates and all its menu parents as active', () => {
  const { getByText } =  render(content())
  expect(getByText('Home').parentElement.parentElement.parentElement.parentElement.className).toBe('item')
  expect(getByText('Admin').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className).toBe('item active')
})

test('Clicking Transactions will trigger a dispatch of setActivePage', () => {
  render(content())
  const transactionsMenuOption = screen.getByText('Transactions')

  expect(screen.getByText('Transactions')).toBeInTheDocument()
  fireEvent.click(transactionsMenuOption)
  
  expect(mockDispatch).toHaveBeenCalledWith({
    payload: "TRANSACTIONS",
    type: "default/setActivePage"
  })
})
