import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import GenericTemplate from './GenericTemplate'
import { TemplateTypes, TemplateApiTypes } from 'types/service/templates';

const activeUser = 'MY_ACTIVE_USER'
const otherUser = 'SOME_OTHER_USER'

const templates = [
  {
    channel: '',
    created: null,
    event: null,
    id: 787,
    locale: null,
    message: null,
    name: 'mocked-template-1',
    nextVersion: 91,
    type: 'HTML',
    updated: '2020-11-09T09:07:25.000+0000',
    updatedBy: activeUser,
    values: {
      url: '',
      body: 'My nice template 1'
    },
    version: 90
  },
  {
    channel: '',
    created: null,
    event: null,
    id: 788,
    locale: null,
    message: null,
    name: 'mocked-template-2',
    nextVersion: 91,
    type: 'HTML',
    updated: '2020-11-05T09:07:25.000+0000',
    updatedBy: activeUser,
    values: {
      url: '',
      body: 'My nice template 2'
    },
    version: 90
  },
  {
    channel: '',
    created: null,
    event: null,
    id: 789,
    locale: null,
    message: null,
    name: 'mocked-template-3',
    nextVersion: 91,
    type: 'HTML',
    updated: '2020-11-02T09:07:25.000+0000',
    updatedBy: otherUser,
    values: {
      url: '',
      body: 'My nice template 3'
    },
    version: 90
  },
  {
    channel: '',
    created: null,
    event: null,
    id: 790,
    locale: null,
    message: null,
    name: 'mocked-template-4',
    nextVersion: 91,
    type: 'EMAIL',
    updated: '2020-11-02T09:07:25.000+0000',
    updatedBy: otherUser,
    values: {
      subject: 'My email template',
      url: '',
      body: 'My nice template 4'
    },
    version: 90
  }
]

const server = setupServer(
  rest.get('/paymentiq/backoffice/api/template/html/*', (req, res, ctx) => {
    return res(ctx.json({
      result: templates
    }))
  }),
  rest.put('/paymentiq/backoffice/api/template/*', (req, res, ctx) => {
    return res(ctx.json({
      result: templates[0]
    }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


const mockDispatch = jest.fn()
jest.mock('redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (callback) => {
    return callback({
      metadataReducer: {
        roles: require('../../../test/unit/mockdata').roles
      },
      contextReducer: {
        merchantId: '1000',
        userName: activeUser,
        activePage: 'ADMIN_TEMPLATES_HTML', // default to Html templates
        showDesktopSidebar: true
      }
    })
  }
}))

const content = () => (
  <Router>
    <Provider store={store}>
      <GenericTemplate templateType={TemplateTypes.HTML} templateApiType={TemplateApiTypes.HTML}/>
    </Provider>
  </Router>
)

test('Fetches and renders the three mocked templates in the dropdown', async () => {
  render(content())
  
  
  const templates = await screen.findAllByText(/mocked-template-[1-9]/)
  expect(screen.queryByRole('heading', { name: 'Select template' })).toBeInTheDocument() // <h5>Select template</h5>
  expect(screen.queryByRole('button', { name: 'New template' })).toBeInTheDocument()

  // All mocked templates are named mocked-template-1, mocked-template-2 etc
  // This is in the dropdown (i.e all templates)
  expect(templates).toHaveLength(4)
})

test('Fetches and renders the two templates recently edited by the current user, when changing to edited by others, only one is shown', async () => {
  render(content())
  
  // All mocked templates are named mocked-template-1, mocked-template-2 etc
  // This is in the dropdown (i.e all templates). We include this to wait for the fetching and rendering of templates
  const templates = await screen.findAllByText(/mocked-template-[1-9]/)
  expect(templates).toHaveLength(4)
  
  // Default is show templates recently edited by -> you
  // getByText returns a selector that will start of from the element returned in the querySelector
  // We should only get the first 2 templates - since these have the matching lastEditedBy username as the one we set in store (activeUser)
  const { getByText, queryByText } = within(document.querySelector('[class^="RecentTemplates__RecentContainer"]'))
  expect(getByText('mocked-template-1')).toBeInTheDocument()
  expect(getByText('mocked-template-2')).toBeInTheDocument()
  expect(queryByText('mocked-template-3')).not.toBeInTheDocument()
  expect(queryByText('mocked-template-4')).not.toBeInTheDocument()

  // Select show recent edited by others -> Should only show mocked-template-3
  fireEvent.click(getByText('others'))
  expect(queryByText('mocked-template-1')).not.toBeInTheDocument()
  expect(queryByText('mocked-template-2')).not.toBeInTheDocument()
  expect(queryByText('mocked-template-3')).toBeInTheDocument()
  expect(queryByText('mocked-template-4')).toBeInTheDocument()
})

test('Fetches and renders the two templates recently edited by the current user, when changing to edited by anyone, all four are shown', async () => {
  render(content())
  
  // All mocked templates are named mocked-template-1, mocked-template-2 etc
  // This is in the dropdown (i.e all templates). We include this to wait for the fetching and rendering of templates
  const templates = await screen.findAllByText(/mocked-template-[1-9]/)
  expect(templates).toHaveLength(4)
  
  // Default is show templates recently edited by -> you
  // getByText returns a selector that will start of from the element returned in the querySelector
  // We should only get the first 2 templates - since these have the matching lastEditedBy username as the one we set in store (activeUser)
  const { getByText, queryByText } = within(document.querySelector('[class^="RecentTemplates__RecentContainer"]'))
  expect(getByText('mocked-template-1')).toBeInTheDocument()
  expect(getByText('mocked-template-2')).toBeInTheDocument()
  expect(queryByText('mocked-template-3')).not.toBeInTheDocument()
  expect(queryByText('mocked-template-4')).not.toBeInTheDocument()
  
  // Select show recent edited by others -> Should only show mocked-template-3
  fireEvent.click(getByText('anyone'))
  expect(queryByText('mocked-template-1')).toBeInTheDocument()
  expect(queryByText('mocked-template-2')).toBeInTheDocument()
  expect(queryByText('mocked-template-3')).toBeInTheDocument()
  expect(queryByText('mocked-template-4')).toBeInTheDocument()
})

test('Selecting the first item in the dropdown sets it as selected and displays the editor and action buttons', async () => {
  render(content())
  
  // Let the templates be fetched and rendered
  await screen.findByText('mocked-template-1')
  const dropdownContainer = within(document.querySelector('[class^="GenericTemplate__DropdownWrapper"]'))
  expect(dropdownContainer.queryByRole('html')).not.toBeInTheDocument()

  expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Edit details' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  
  const editorContainer = within(document.querySelector('[class^="EditorElements__EditorWrapper"]'))
  fireEvent.click(dropdownContainer.getByText('mocked-template-1'))

  await waitFor(() => {
    // Means the editor is loading - good enough
    expect(editorContainer.getByText('Loading...')).toBeInTheDocument()
  });

  expect(editorContainer.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  expect(editorContainer.getByRole('button', { name: 'Edit details' })).toBeInTheDocument()
  expect(editorContainer.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('Selecting the template with type EMAIL should render a subject input', async () => {
  render(content())
  
  // Let the templates be fetched and rendered
  await screen.findByText('mocked-template-1')
  const dropdownContainer = within(document.querySelector('[class^="GenericTemplate__DropdownWrapper"]'))
  expect(dropdownContainer.queryByRole('html')).not.toBeInTheDocument() // The editor is not yet rendered

  expect(screen.queryByRole('input', { value: templates[3].values.subject })).not.toBeInTheDocument() // no subject input rendered yet
  expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Edit details' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  
  const editorContainer = within(document.querySelector('[class^="EditorElements__EditorWrapper"]'))
  fireEvent.click(dropdownContainer.getByText(templates[3].name))

  await waitFor(() => {
    // Means the editor is loading - good enough
    expect(editorContainer.getByText('Loading...')).toBeInTheDocument()
  });

  expect(screen.queryByRole('input', { value: templates[3].values.subject })).not.toBeInTheDocument() // subject input is now rendered
  expect(editorContainer.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  expect(editorContainer.getByRole('button', { name: 'Edit details' })).toBeInTheDocument()
  expect(editorContainer.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('Selecting the first item in the dropdown and clicking save triggers a save-request and re-render with an updated name', async () => {
  render(content())
  
  // Let the templates be fetched and rendered
  await screen.findByText('mocked-template-1')
  const dropdownContainer = within(document.querySelector('[class^="GenericTemplate__DropdownWrapper"]'))
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  
  const editorContainer = within(document.querySelector('[class^="EditorElements__EditorWrapper"]'))
  fireEvent.click(dropdownContainer.getByText('mocked-template-1'))

  await waitFor(() => {
    // Means the editor is loading - good enough
    expect(editorContainer.getByText('Loading...')).toBeInTheDocument()
    expect(editorContainer.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(editorContainer.getByRole('button', { name: 'Edit details' })).toBeInTheDocument()
    expect(editorContainer.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  });

  fireEvent.click(editorContainer.getByRole('button', { name: 'Save' }))

  await waitFor(() => {
    expect(screen.getAllByText('mocked-template-1')[0].parentElement.className).toContain('selection dropdown template-dropdown-menu') // meaning it is the selected one in the dropdown after saving
    expect(screen.getAllByText('mocked-template-1')[1].parentElement.className).toBe('active selected item') // meaning it is marked as selected in the recently edited by list
  })
})

test('Clicking New template should render the editor container and Delete + Save button', async () => {
  render(content())
  
  // Let the templates be fetched and rendered
  await screen.findByText('mocked-template-1')
  const dropdownContainer = within(document.querySelector('[class^="GenericTemplate__DropdownWrapper"]'))
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  
  // fireEvent.click(dropdownContainer.getByText('mocked-template-1'))
  const editorContainer = within(document.querySelector('[class^="EditorElements__EditorWrapper"]'))
  fireEvent.click(screen.getByRole('button', { name: 'New template' }))

  await waitFor(() => {
    expect(editorContainer.getByText('Loading...')).toBeInTheDocument()
    expect(editorContainer.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(editorContainer.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
