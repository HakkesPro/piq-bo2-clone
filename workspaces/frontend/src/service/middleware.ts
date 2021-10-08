import { GET } from './REST';

export const fetchMerchantMessages = async (
  merchantId: number,
  startIndex: number,
  endIndex: undefined|number,
  searchInputValue?: undefined|string,
): Promise<any> => {
  const searchValue = searchInputValue ? `&searchInput=${searchInputValue}` : '';
  const response = await GET(
    `/paymentiq/api-proxy/messages?merchantId=${merchantId}&start=${startIndex}&end=${endIndex}${searchValue}`,
  );
  return response.json();
};
