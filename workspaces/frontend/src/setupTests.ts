// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import userEvent from '@testing-library/user-event'
import { configure } from '@testing-library/dom';

configure({
  testIdAttribute: 'testID',
});

global.getHtml = () => document.body.innerHTML;
global.logHtml = () => console.log(getHtml());

/*
 * Add mocks to global scope here
 */

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

/*
 * A fix for some bug in react-testing-library
 * https://github.com/nickcolley/jest-axe/issues/147
 */

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
