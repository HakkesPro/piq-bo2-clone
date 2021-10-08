/* eslint-disable no-console */
import type { AppConfig } from 'types/app-config-types';
import { EnvironmentTypes } from 'types/app-config-types';

/*
  Local config file for local dev setup + deploy
  This file dont get comitted and will overwrite app-config.ts locally.
*/

// eslint-disable-next-line import/no-mutable-exports
let appConfig: AppConfig = {
  [EnvironmentTypes.PRODUCTION]: {
    // https://backoffice.paymentiq.io/paymentiq/bo
    legacyBackofficeUrl: `${window.location.origin}/paymentiq/bo/`,
    boApiEndpoint: 'https://backoffice.paymentiq.io',
    piqApiEndpoint: 'https://api.paymentiq.io',
  },
  [EnvironmentTypes.TEST]: {
    // https://test-backoffice.paymentiq.io/paymentiq/bo
    legacyBackofficeUrl: `${window.location.origin}/paymentiq/bo/`,
    boApiEndpoint: 'https://test-bo.paymentiq.io',
    piqApiEndpoint: 'https://test-api.paymentiq.io',
  },

  // use this dev config to target PIQ running on localhost. To login, go to http://localhost:11337/#login
  // Trouble loggin in? Make sure your user is enabled and that last signIn-date is not older than 3 months (in db)
  [EnvironmentTypes.DEV]: {
    legacyBackofficeUrl: 'http://127.0.0.1:3337',
    boApiEndpoint: 'http://127.0.0.1:11337',
    piqApiEndpoint: 'https://test-api.paymentiq.io',
    proxy: {
      target: 'http://localhost:8080',
      headers: {
        Connection: 'keep-alive',
        secure: false,
      },
    },
  },

  // Run backoffice locally but target all API-requests to PIQ test
  [EnvironmentTypes.DEV_HOSTED]: {
    legacyBackofficeUrl: 'http://127.0.0.1:3337',
    boApiEndpoint: 'http://127.0.0.1:11337',
    piqApiEndpoint: 'https://test-api.paymentiq.io',
    proxy: {
      target: 'https://test-dev.paymentiq.io:443',
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive',
        Host: 'test-dev.paymentiq.io',
      },
    },
  },
};

try {
  // eslint-disable-next-line global-require
  const localConfig = require('./app-config-local');
  appConfig = localConfig.default;
  console.log('Using local app config');
} catch (error) {
  console.log('No local app config added');
}

export default appConfig;
