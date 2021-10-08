import { GET } from '../REST';
import type { MerchantMetaData, GeneralMetaData } from 'types/service/metadata';

export const fetchGeneralMetadata = async (): Promise<GeneralMetaData> => {
  const response = await GET('/paymentiq/backoffice/api/metadata');
  return response.json();
};

export const fetchMerchantMetadata = async (merchantId: number): Promise<MerchantMetaData> => {
  const response = await GET(`/paymentiq/backoffice/api/metadata/${merchantId}`);
  return response.json();
};
