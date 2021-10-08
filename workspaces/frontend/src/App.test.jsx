import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import App from 'App';
import { metadata } from '../test/unit/mockdata.ts';

/*
 * @info - Create tests inside a test() or it(). describe() blocks is not really recommended.
 * xit() excludes a test, and fit() runs only that test.
 */

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}));

jest.mock('components/header/Header', () => () => <div></div>);

jest.mock('./routing/AppRoutes', () => () => <div></div>);

test('Renders the component without throwing error', () => {
  render(
    <Provider store={store}>
      <App metadata={metadata} />
    </Provider>
  );
});
