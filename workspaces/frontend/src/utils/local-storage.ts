import type {
  PaymentIQGeneralSettings,
  LocalStorageData,
} from 'types/local-storage-types';
import { LocalStorageKeys } from 'types/local-storage-types';

export const setPaymentIqGeneralSettings = (
  newValue: PaymentIQGeneralSettings,
): void => {
  const currentSettings: PaymentIQGeneralSettings | false = getLocalStorage(
    LocalStorageKeys.PAYMENTIQ_GENERAL_SETTINGS,
  );
  setLocalStorage(LocalStorageKeys.PAYMENTIQ_GENERAL_SETTINGS, {
    ...(currentSettings || {}),
    ...newValue,
  });
};

export const getLocalStorage = (
  key: LocalStorageKeys,
): LocalStorageData | false => {
  const data: string | null = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

export const setLocalStorage = (
  key: LocalStorageKeys,
  value: string | number | Record<string, unknown>,
): void => {
  const data: string = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, data);
};

export const deleteLocalStorage = (key: LocalStorageKeys): void => {
  localStorage.removeItem(key);
};
