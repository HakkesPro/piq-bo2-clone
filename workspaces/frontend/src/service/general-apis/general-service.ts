import { GET, PUT, POST } from '../REST';
import type {
  MerchantSummary,
  MerchantPaymentMethods,
  MerchantMessages,
  MerchantMessagesPayload,
} from 'types/service/general-service-types';

export const fetchMerchantSummary = async (merchantId: number): Promise<MerchantSummary> => {
  const response = await GET(`/paymentiq/backoffice/api/decisiontable/T12/summary?merchantId=${merchantId}`);
  return response.json();
};

export const fetchMerchantPaymentMethods = async (merchantId: number, dbId: number): Promise<MerchantPaymentMethods> => {
  const response = await GET(`/paymentiq/backoffice/api/decisiontable/${dbId}?merchantId=${merchantId}`);
  return response.json();
};

export const fetchMerchantMessages = async (merchantId: number): Promise<MerchantMessages> => {
  const response = await GET(`/paymentiq/backoffice/api/i18n/keys?merchantId=${merchantId}`);
  return response.json();
};

export const updateMerchantMessages = async (
  merchantId: number,
  payload: MerchantMessagesPayload,
): Promise<MerchantMessages> => {
  const response = await PUT(
    `/paymentiq/backoffice/api/i18n/${payload.id}?merchantId=${merchantId}`,
    payload,
  );
  return response.json();
};

export const addNewMerchantMessages = async (
  merchantId: number,
  payload: Omit<MerchantMessagesPayload, 'id'>,
): Promise<MerchantMessages> => {
  const response = await POST(
    `/paymentiq/backoffice/api/i18n/?merchantId=${merchantId}`,
    payload,
  );
  return response.json();
};
