import { environments } from './types/types.js'

const config = {
  [environments.PRODUCTION]: {
    apiEndpoint: 'https://backoffice.paymentiq.io'
  },
  [environments.TEST]: {
    apiEndpoint: 'https://test-bo.paymentiq.io'
  },
  [environments.DEVELOPMENT]: {
    apiEndpoint: 'https://test-dev.paymentiq.io:443'
  }
}

export default config
