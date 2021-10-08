import appConfig from '../app-config';
import { EnvironmentTypes } from 'types/app-config-types';

const headers = {
  'Content-Type': 'application/json',
};

const env = EnvironmentTypes[process.env.REACT_APP_ENVIRONMENT as EnvironmentTypes];

const getApiUrl = (url: string): string => `${appConfig[env].boApiEndpoint}${url}`;

export const GET = async (url: null|string, fullUrl: string = '') => {
  const requestOptions = {
    method: 'GET',
    headers,
  };
  const res = await fetch(url ? getApiUrl(url) : fullUrl, requestOptions);
  return res;
};

export const POST = async (url: string, body: any) => {
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };
  const res = await fetch(getApiUrl(url), requestOptions);
  return res;
};

export const PUT = async (url: string, body: any) => {
  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  };
  const res = await fetch(getApiUrl(url), requestOptions);
  return res;
};

export const DELETE = async (url: string, body = {}) => {
  const requestOptions = {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
  };
  const res = await fetch(getApiUrl(url), requestOptions);
  return res;
};
