export enum LocalStorageKeys {
  PAYMENTIQ_GENERAL_SETTINGS = 'PAYMENTIQ_GENERAL_SETTINGS',
}

// if more properties are added - make these optional to allow
// partial updated. For example when changing merchantId, you can send in an object
// that only contains merchantId and not the other properties
export type PaymentIQGeneralSettings = {
  merchantId?: number;
};

// if more properties are added in local storage - defined them and add them here as | NewType
export type LocalStorageData = PaymentIQGeneralSettings;
