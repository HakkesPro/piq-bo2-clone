import fetch from 'node-fetch';

import config from '../config.js'

const getHeaders = (jSessionIdCookie) => ({
  'Content-Type': 'application/json',
	cookie: jSessionIdCookie,
});

const baseUrl = config[process.env.NODE_ENV].apiEndpoint

export const GET = async (path, jSessionIdCookie) => {
	console.log('** get **')
	const response = await fetch(`${baseUrl}${path}`, {
		method: 'GET',
		headers: getHeaders(jSessionIdCookie),
	});
	const json = await response.json();
	return json;
};
