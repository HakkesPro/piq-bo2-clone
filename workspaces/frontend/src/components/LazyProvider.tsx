import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'redux/store';

interface Props {
  content: JSX.Element;
}

const LazyProvider: React.FC<Props> = ({ content }) => (
  <Provider store={store}>{content}</Provider>
);

export default LazyProvider;
