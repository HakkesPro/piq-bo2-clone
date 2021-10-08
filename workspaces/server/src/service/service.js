import { GET } from './http.js'

export const fetchMessages = async (merchantId, JSESSIONID) => {
  const data = await GET(`/paymentiq/backoffice/api/i18n/keys?merchantId=${merchantId}`, JSESSIONID)
  return data
}
