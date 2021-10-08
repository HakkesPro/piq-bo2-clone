import { GET } from '../REST';

export const authCheck = (): Promise<Response> => GET('/paymentiq/backoffice/api/metadata');

export const logout = (): Promise<Response> =>
  // returns a 302 redirect to auth.iqservices i.e the login page via keycloak
  GET('/paymentiq/logout');
