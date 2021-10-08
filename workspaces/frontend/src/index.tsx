import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'utils/style/index.scss';
import 'semantic-ui-css/semantic.min.css';
import FullScreenLoader from 'components/FullScreenLoader';
import { checkIsAuthenticated } from 'utils/helpers';
import type { GeneralMetaData } from 'types/service/metadata';
import type { AuthStatus } from 'types/global-types';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Dynamic imports
const App = React.lazy(() => import('./AppSidebar'));
// Lazy-load the store to not display any default store values if not authenticated (OWASP best practices)
const LazyProvider = React.lazy(() => import('components/LazyProvider'));

const renderReactDOM = (Content: React.FC) => {
  ReactDOM.render(<Content />, document.getElementById('root'));
};

const storeWrapper = (metadata: GeneralMetaData) => <LazyProvider content={<App metadata={metadata} />} />;
// We use an actual suspsense fallback wrapped around each route to show ViewLoader
const suspenseWrapper = (Content: React.FC) => (
  <Suspense fallback={<FullScreenLoader />}>
    <Content />
  </Suspense>
);

const redirectToLogin = (loginPath: string) => {
  window.location.href = `/${loginPath}`;
};

const init = async () => {
  const {
    isAuthenticated,
    authPath,
    metadata,
    statusCode,
  }: AuthStatus = await checkIsAuthenticated();
  if (isAuthenticated && metadata && statusCode === 200) {
    return renderReactDOM(() => suspenseWrapper(() => storeWrapper(metadata)));
  }
  if (authPath) {
    return redirectToLogin(authPath);
  }
  // Todo Build a proper failure component
  return (
    <div>
      <h2>Login failed - please contact support</h2>
      <p>Failure code: {statusCode}</p>
    </div>
  );
};

// default to showing the fullscreen loader
renderReactDOM(FullScreenLoader);
// then run the app init
init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorkerRegistration.unregister();
