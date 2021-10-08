import type { MerchantId } from 'types/global-types';

/* ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##
*
*    Shared MetaData types
*
*/

type ArbitraryObject = Record<number|string, Record<string, unknown>>

export type MetaDataGeneralKeyStringArray = Record<number, string[]>

export type MetaDataGeneralKeyArbitraryObject = Record<number, ArbitraryObject>

export type MetaDataGeneralKeyStringValue = Record<number, string>

export type MetaDataGeneralKeyNumberValue = Record<number, number>

export type MetaDataGeneralKeyBooleanValue = Record<number, boolean>

/* ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##
*
*    General MetaData
*
*/

export type GeneralMetaDataAllMerchants = Record<number, GeneralMetaDataMerchant>

export type GeneralMetaDataMerchant = {
  accessible: boolean,
  alertEmail: string,
  children: Array<GeneralMetaDataMerchant>,
  childrenId: Array<number>,
  companyName: string,
  companyUrl: string|null,
  contactEmail: string,
  contactPerson: string,
  contactPhone: string,
  created: string|null,
  createdBy: string|null,
  customerId: number,
  description: string,
  enabled: boolean,
  event: string,
  id: number,
  message: string|null,
  name: string,
  nextVersion: number,
  parentId: number|null,
  platform: number|string,
  status: string,
  updated: string|null,
  updatedBy: string|null,
  version: number
}

enum GeneralMetaDataGeneralStatuses {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED',
  HIDDEN = 'HIDDEN'
}

enum GeneralMetaDataInvoiceStates {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  DELETED = 'DELETED',
  NOT_VALID = 'NOT_VALID',
  FAILED_TO_SEND = 'FAILED_TO_SEND',
  CANCELLED = 'CANCELLED',
  FAILED_TO_CANCEL = 'FAILED_TO_CANCEL',
  FAILED_TO_UPDATE = 'FAILED_TO_UPDATE',
  BOOKED = 'BOOKED',
  FULLY_PAID = 'FULLY_PAID',
  CREDITED = 'CREDITED',
  FAILED_TO_CREDIT = 'FAILED_TO_CREDIT',
  OVERDUE = 'OVERDUE'
}

enum GeneralMetaDataLifeCycles {
  ONBOARDING = 'Onboarding',
  RAMPING_UP = 'Ramping up',
  NOURISHING = 'Nourishing',
  CHURNING = 'Churning',
  CHURNED = 'Churned',
}

enum GeneralMetaDataPaymentTxStates {
  SUCCESSFUL = 'SUCCESSFUL',
  REGISTERED = 'REGISTERED',
  PROCESSING = 'PROCESSING',
  WAITING_INPUT = 'WAITING_INPUT',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  FAILED = 'FAILED',
  INCONSISTENT = 'INCONSISTENT',
  CANCELLED = 'CANCELLED',
  REPROCESSING = 'REPROCESSING'
}

enum GeneralMetaDataPaymentTxStatuses {
  SUCCESS = 'SUCCESS',
  SUCCESS_WITHDRAWAL_APPROVAL = 'SUCCESS_WITHDRAWAL_APPROVAL',
  SUCCESS_WITHDRAWAL_AUTO_APPROVAL = 'SUCCESS_WITHDRAWAL_AUTO_APPROVAL',
  SUCCESS_WAITING_CAPTURE = 'SUCCESS_WAITING_CAPTURE',
  SUCCESS_WAITING_AUTO_CAPTURE = 'SUCCESS_WAITING_AUTO_CAPTURE',
  SUCCESS_AUTO_CAPTURED = 'SUCCESS_AUTO_CAPTURED',
  SUCCESS_CAPTURED = 'SUCCESS_CAPTURED',
  SUCCESS_WAITING_CONFIRMATION = 'SUCCESS_WAITING_CONFIRMATION',
  SUCCESS_3D_AUTH_ATTEMPT_REGD = 'SUCCESS_3D_AUTH_ATTEMPT_REGD',
  SUCCESS_3D_2_NOT_SUPPORTED_BY_ISSUER = 'SUCCESS_3D_2_NOT_SUPPORTED_BY_ISSUER',
  SUCCESS_3D_FRICTIONLESS = 'SUCCESS_3D_FRICTIONLESS',
  SUCCESS_3D_CHALLENGED = 'SUCCESS_3D_CHALLENGED',
  SUCCESS_3D_1 = 'SUCCESS_3D_1',
  SUCCESS_NON_3D = 'SUCCESS_NON_3D',
  REGISTERED = 'REGISTERED',
  PROCESSING_PROVIDER = 'PROCESSING_PROVIDER',
  PROCESSING_MERCHANT = 'PROCESSING_MERCHANT',
  CONT_WITH_N3DS = 'CONT_WITH_N3DS',
  PROCESSING_USER_VERIFICATION = 'PROCESSING_USER_VERIFICATION',
  PROCESSING_USER_AUTHORISATION = 'PROCESSING_USER_AUTHORISATION',
  PROCESSING_KYC_VERIFICATION = 'PROCESSING_KYC_VERIFICATION',
  CONT_WITH_3D_1 = 'CONT_WITH_3D_1',
  REPROCESSING_PROVIDER = 'REPROCESSING_PROVIDER',
  REPROCESSING_MERCHANT = 'REPROCESSING_MERCHANT',
  WAITING_INPUT = 'WAITING_INPUT',
  WAITING_3D_SECURE = 'WAITING_3D_SECURE',
  WAITING_DEPOSIT_CONFIRMATION = 'WAITING_DEPOSIT_CONFIRMATION',
  WAITING_NOTIFICATION = 'WAITING_NOTIFICATION',
  WAITING_WITHDRAWAL_CONFIRMATION = 'WAITING_WITHDRAWAL_CONFIRMATION',
  WAITING_KYC_VERIFICATION = 'WAITING_KYC_VERIFICATION',
  WAITING_MERCHANT_NOTIFICATION = 'WAITING_MERCHANT_NOTIFICATION',
  WAITING_DEPOSIT_APPROVAL = 'WAITING_DEPOSIT_APPROVAL',
  WAITING_WITHDRAWAL_APPROVAL = 'WAITING_WITHDRAWAL_APPROVAL',
  WAITING_DEPOSIT_AUTO_APPROVAL = 'WAITING_DEPOSIT_AUTO_APPROVAL',
  WAITING_WITHDRAWAL_AUTO_APPROVAL = 'WAITING_WITHDRAWAL_AUTO_APPROVAL',
  WAITING_DEPOSIT_ON_HOLD_APPROVAL = 'WAITING_DEPOSIT_ON_HOLD_APPROVAL',
  WAITING_WITHDRAWAL_ON_HOLD_APPROVAL = 'WAITING_WITHDRAWAL_ON_HOLD_APPROVAL',
  WAITING_WITHDRAWAL_SECOND_APPROVAL = 'WAITING_WITHDRAWAL_SECOND_APPROVAL',
  ERR_READ_TIMEOUT = 'ERR_READ_TIMEOUT',
  ERR_REFERENCE_MISMATCH = 'ERR_REFERENCE_MISMATCH',
  ERR_INCONSISTENT_TRANSACTION = 'ERR_INCONSISTENT_TRANSACTION',
  ERR_UNKNOWN_CALLBACK = 'ERR_UNKNOWN_CALLBACK',
  ERR_IO_EXCEPTION = 'ERR_IO_EXCEPTION',
  ERR_UNKNOWN_RESPONSE = 'ERR_UNKNOWN_RESPONSE',
  ERR_KAFKA_MESSAGE_NOT_SENT = 'ERR_KAFKA_MESSAGE_NOT_SENT',
  ERR_AMOUNT_MISMATCH = 'ERR_AMOUNT_MISMATCH',
  ERR_INVALID_SIGNATURE = 'ERR_INVALID_SIGNATURE',
  ERR_IP_NOT_WHITELISTED = 'ERR_IP_NOT_WHITELISTED',
  ERR_NAME_MISMATCH = 'ERR_NAME_MISMATCH',
  ERR_SYSTEM_ERROR = 'ERR_SYSTEM_ERROR',
  ERR_FAILED_TO_CONNECT = 'ERR_FAILED_TO_CONNECT',
  ERR_DECLINED_BAD_REQUEST = 'ERR_DECLINED_BAD_REQUEST',
  ERR_DECLINED_FRAUD = 'ERR_DECLINED_FRAUD',
  ERR_DECLINED_NO_FUNDS = 'ERR_DECLINED_NO_FUNDS',
  ERR_DECLINED_ACCOUNT_SUSPENDED = 'ERR_DECLINED_ACCOUNT_SUSPENDED',
  ERR_DECLINED_OTHER_REASON = 'ERR_DECLINED_OTHER_REASON',
  ERR_DECLINED_CONTACT_SUPPORT = 'ERR_DECLINED_CONTACT_SUPPORT',
  ERR_DECLINED_CONFIG_ERROR = 'ERR_DECLINED_CONFIG_ERROR',
  ERR_NOT_AUTHENTICATED = 'ERR_NOT_AUTHENTICATED',
  ERR_INVALID_RESPONSE = 'ERR_INVALID_RESPONSE',
  ERR_DECLINED_REQ_BLOCKED = 'ERR_DECLINED_REQ_BLOCKED',
  ERR_PSP_OUT_OF_SERVICE = 'ERR_PSP_OUT_OF_SERVICE',
  ERR_DECLINED_NOT_AUTHORIZED = 'ERR_DECLINED_NOT_AUTHORIZED',
  ERR_RESPONSE_CODE_UNKNOWN = 'ERR_RESPONSE_CODE_UNKNOWN',
  ERR_PSP_ACCOUNT_USED_BY_OTHER_USER = 'ERR_PSP_ACCOUNT_USED_BY_OTHER_USER',
  ERR_PSP_ACCOUNT_NOT_USED = 'ERR_PSP_ACCOUNT_NOT_USED',
  ERR_TOO_MANY_PSP_ACCOUNTS = 'ERR_TOO_MANY_PSP_ACCOUNTS',
  ERR_DECLINED_DUPLICATE_TX_ID = 'ERR_DECLINED_DUPLICATE_TX_ID',
  ERR_DECLINED_INVALID_ACCOUNT_NUMBER = 'ERR_DECLINED_INVALID_ACCOUNT_NUMBER',
  ERR_MERCHANT_OUT_OF_SERVICE = 'ERR_MERCHANT_OUT_OF_SERVICE',
  ERR_DECLINED_LIMIT_OVERDRAWN = 'ERR_DECLINED_LIMIT_OVERDRAWN',
  ERR_MERCHANT_RESPONSE_CODE_UNKNOWN = 'ERR_MERCHANT_RESPONSE_CODE_UNKNOWN',
  ERR_DECLINED_NO_PROVIDER_FOUND = 'ERR_DECLINED_NO_PROVIDER_FOUND',
  ERR_DECLINED_PROVIDER_ACCOUNT_CONFIG_ERROR = 'ERR_DECLINED_PROVIDER_ACCOUNT_CONFIG_ERROR',
  ERR_MERCHANT_INVALID_RESPONSE = 'ERR_MERCHANT_INVALID_RESPONSE',
  ERR_ABOVE_LIMIT = 'ERR_ABOVE_LIMIT',
  ERR_BELOW_LIMIT = 'ERR_BELOW_LIMIT',
  ERR_DECLINED_BANK_REFUSAL = 'ERR_DECLINED_BANK_REFUSAL',
  ERR_DECLINED_CARD_EXPIRED = 'ERR_DECLINED_CARD_EXPIRED',
  ERR_DECLINED_CVV_FAIL = 'ERR_DECLINED_CVV_FAIL',
  ERR_DECLINED_EMAIL_BLACKLIST = 'ERR_DECLINED_EMAIL_BLACKLIST',
  ERR_DECLINED_FRAUD_RULE_PSP = 'ERR_DECLINED_FRAUD_RULE_PSP',
  ERR_DECLINED_INVALID_AMOUNT = 'ERR_DECLINED_INVALID_AMOUNT',
  ERR_DECLINED_INVALID_ISSUER = 'ERR_DECLINED_INVALID_ISSUER',
  ERR_DECLINED_ISSUER_UNAVAILABLE = 'ERR_DECLINED_ISSUER_UNAVAILABLE',
  ERR_DECLINED_LOST_OR_STOLEN = 'ERR_DECLINED_LOST_OR_STOLEN',
  ERR_DECLINED_RESTRICTED_CARD = 'ERR_DECLINED_RESTRICTED_CARD',
  ERR_DECLINED_RESTRICTED_TERRITORY = 'ERR_DECLINED_RESTRICTED_TERRITORY',
  ERR_DECLINED_VELOCITY_RULE_PSP = 'ERR_DECLINED_VELOCITY_RULE_PSP',
  ERR_INVALID_PARAMETER = 'ERR_INVALID_PARAMETER',
  ERR_RESPONSIBLE_GAMING_LIMIT = 'ERR_RESPONSIBLE_GAMING_LIMIT',
  ERR_USER_ACCOUNT_BLOCKED = 'ERR_USER_ACCOUNT_BLOCKED',
  ERR_USER_SESSION_INVALID = 'ERR_USER_SESSION_INVALID',
  ERR_DECLINED_3D_VALIDATION_FAILED = 'ERR_DECLINED_3D_VALIDATION_FAILED',
  ERR_DECLINED_3D_EXPIRED = 'ERR_DECLINED_3D_EXPIRED',
  ERR_DECLINED_3D_NO_PROTECTION = 'ERR_DECLINED_3D_NO_PROTECTION',
  ERR_DECLINED_3D_AUTH_TECH_FAIL = 'ERR_DECLINED_3D_AUTH_TECH_FAIL',
  ERR_DECLINED_3D_AUTH_REJECTED = 'ERR_DECLINED_3D_AUTH_REJECTED',
  ERR_DECLINED_3D_AUTH_USER_FAIL = 'ERR_DECLINED_3D_AUTH_USER_FAIL',
  ERR_VAULTIQ_OUT_OF_SERVICE = 'ERR_VAULTIQ_OUT_OF_SERVICE',
  ERR_DECLINED_IP_BLOCKED = 'ERR_DECLINED_IP_BLOCKED',
  ERR_DECLINED_BIN_BLOCKED = 'ERR_DECLINED_BIN_BLOCKED',
  ERR_VAULTIQ_UNKNOWN_ACCOUNT = 'ERR_VAULTIQ_UNKNOWN_ACCOUNT',
  ERR_DECLINED_KYC_BLOCK = 'ERR_DECLINED_KYC_BLOCK',
  ERR_DECLINED_KYC_USER_UNDER_AGE = 'ERR_DECLINED_KYC_USER_UNDER_AGE',
  ERR_DECLINED_KYC_CHECK_FAILED = 'ERR_DECLINED_KYC_CHECK_FAILED',
  ERR_DECLINED_BIC_BLOCK = 'ERR_DECLINED_BIC_BLOCK',
  ERR_DECLINED_EXPIRED = 'ERR_DECLINED_EXPIRED',
  ERR_DECLINED_REPEAT_CANCELLED = 'ERR_DECLINED_REPEAT_CANCELLED',
  ERR_DECLINED_CURRENCY_NOT_SUPPORTED = 'ERR_DECLINED_CURRENCY_NOT_SUPPORTED',
  ERR_DECLINED_FRAUD_SCORE_THRESHOLD_EXCEEDED = 'ERR_DECLINED_FRAUD_SCORE_THRESHOLD_EXCEEDED',
  ERR_DECLINED_MERCHANT_NOT_FOUND = 'ERR_DECLINED_MERCHANT_NOT_FOUND',
  ERR_DECLINED_MERCHANT_NOT_ENABLED = 'ERR_DECLINED_MERCHANT_NOT_ENABLED',
  ERR_DECLINED_PROVIDER_NOT_ENABLED = 'ERR_DECLINED_PROVIDER_NOT_ENABLED',
  ERR_DECLINED_UNDER_MAINTENANCE = 'ERR_DECLINED_UNDER_MAINTENANCE',
  ERR_NO_REFERRAL_TX_FOUND = 'ERR_NO_REFERRAL_TX_FOUND',
  ERR_DECLINE_TX_NOT_FOUND = 'ERR_DECLINE_TX_NOT_FOUND',
  ERR_DECLINE_COUNTRY_NOT_SUPPORTED = 'ERR_DECLINE_COUNTRY_NOT_SUPPORTED',
  ERR_DECLINED_NOT_SUPPORTED_PAYMENT_METHOD_FRAUD = 'ERR_DECLINED_NOT_SUPPORTED_PAYMENT_METHOD_FRAUD',
  ERR_DECLINED_FRAUD_PROVIDER_ACCOUNT_CONFIG_ERROR = 'ERR_DECLINED_FRAUD_PROVIDER_ACCOUNT_CONFIG_ERROR',
  ERR_DECLINED_GENERAL_BLOCK = 'ERR_DECLINED_GENERAL_BLOCK',
  ERR_DECLINED_3D_PROVIDER_ACCOUNT_CONFIG_ERROR = 'ERR_DECLINED_3D_PROVIDER_ACCOUNT_CONFIG_ERROR',
  ERR_DECLINE_USER_NOT_FOUND = 'ERR_DECLINE_USER_NOT_FOUND',
  ERR_DECLINE_NO_AMOUNTS = 'ERR_DECLINE_NO_AMOUNTS',
  ERR_UNSUPPORTED_CHARACTERS = 'ERR_UNSUPPORTED_CHARACTERS',
  ERR_MESSAGE_SENT_TO_KAFKA_FAILED = 'ERR_MESSAGE_SENT_TO_KAFKA_FAILED',
  ERR_DECLINED_3D_INIT_SYSTEM_ERROR = 'ERR_DECLINED_3D_INIT_SYSTEM_ERROR',
  ERR_DECLINED_ID_VERIFICATION_FAILED = 'ERR_DECLINED_ID_VERIFICATION_FAILED',
  ERR_DECLINED_SCA_REQUIRED_BY_ISSUER = 'ERR_DECLINED_SCA_REQUIRED_BY_ISSUER',
  ERR_DECLINED_MISSING_REDIRECT_URL = 'ERR_DECLINED_MISSING_REDIRECT_URL',
  ERR_DECLINED_SCHEME_TOKEN_EXPIRED = 'ERR_DECLINED_SCHEME_TOKEN_EXPIRED',
  ERR_DECLINED_INVALID_SCHEME_TOKEN = 'ERR_DECLINED_INVALID_SCHEME_TOKEN',
  ERR_DECLINED_MERCHANT_NO_FUNDS = 'ERR_DECLINED_MERCHANT_NO_FUNDS',
  ERR_DECLINED_NAME_MISMATCH = 'ERR_DECLINED_NAME_MISMATCH',
  ERR_DECLINED_WAITING_KYC_VERIFICATION = 'ERR_DECLINED_WAITING_KYC_VERIFICATION',
  ERR_DECLINED_3D_AUTH_SYSTEM_ERROR = 'ERR_DECLINED_3D_AUTH_SYSTEM_ERROR',
  ERR_CANCELLED_BY_USER = 'ERR_CANCELLED_BY_USER',
  ERR_CANCELLED_BY_MERCHANT = 'ERR_CANCELLED_BY_MERCHANT',
  ERR_CANCELLED_BY_PSP = 'ERR_CANCELLED_BY_PSP',
  ERR_NOT_SUPPORTED = 'ERR_NOT_SUPPORTED',
  ERR_CANCELLED_TIMEOUT = 'ERR_CANCELLED_TIMEOUT',
}

interface UserAuthorityRole {
  authority: PaymentIqRoles
}

interface GeneralMetaDataUser {
  accessTokenHash: string,
  accountNonExpired: boolean,
  accountNonLocked: boolean,
  address: {
    formatted: string|null,
    streetAddress: string|null,
    locality: string|null,
    region: string|null,
    postalCode: string|null,
    country: string|null
  },
  allowedMerchantIds: [],
  attributes: {
    // eslint-disable-next-line camelcase
    at_hash: string,
    sub: string,
    // eslint-disable-next-line camelcase
    resource_access: Record<string, string>
  },
  audience: string[],
  authenticatedAt: string,
  authenticationContextClass: string,
  authenticationMethods: string|null,
  authorities: UserAuthorityRole[],
  authorizationCodeHash: string|null
  authorizedParty: string,
  birthdate: string|null,
  claims: Record<string, string>,
  created: string|null,
  credentialsNonExpired: true,
  displayUsername: string,
  email: string,
  emailVerified: boolean,
  enabled: boolean,
  event: string|null
  expiresAt: string,
  familyName: string,
  fullName: string,
  gender: string|null
  givenName: string,
  id: string,
  idToken: Record<string, string>,
  issuedAt: string,
  issuer: string,
  lastIpAddress: null,
  lastLogin: null,
  locale: null,
  loginAttempts: number,
  merchantId: number,
  message: string|null
  middleName: string|null
  mobile: string|null,
  name: string|null,
  nextVersion: 2,
  nickName: string|null,
  nonce: string|null,
  oauthUser: boolean,
  password: null | string,
  passwordNonExpired: boolean,
  passwordResetToken: string|null,
  phoneNumber: string,
  phoneNumberVerified: null,
  picture: null,
  preferences: string,
  preferredUsername: string,
  profile: null,
  requiredActions: [],
  subject: string,
  twoFactorCondition: string,
  twoFactorCredentials: [],
  updated: null,
  updatedAt: null,
  updatedBy: null,
  userInfo: Record<string, string>,
  username: string,
  version: number,
  website: null,
  zoneInfo: null
}

enum GeneralMetaDataPitaIndex {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HEIGHT = 'HIGH'
}

enum GeneralMetaDataTiers {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3'
}

export type GeneralMetaData = {
  accountManagers: MetaDataGeneralKeyStringArray
  allMerchants: GeneralMetaDataAllMerchants
  availableKycProviderTypes: MetaDataGeneralKeyStringArray
  customerStatuses: GeneralMetaDataGeneralStatuses
  integrationServices: MetaDataGeneralKeyStringArray
  invoiceStates: GeneralMetaDataInvoiceStates
  licenses: MetaDataGeneralKeyStringArray
  lifeCycles: GeneralMetaDataLifeCycles
  merchant: MetaDataGeneralKeyNumberValue
  merchantPlatforms: MetaDataGeneralKeyStringArray
  merchantStatuses: GeneralMetaDataGeneralStatuses
  paymentTxStates: GeneralMetaDataPaymentTxStates
  paymentTxStatuses: GeneralMetaDataPaymentTxStatuses
  paymentTxTypes: MetaDataGeneralKeyStringArray
  pitaIndexes: GeneralMetaDataPitaIndex
  products: MetaDataGeneralKeyStringArray
  projects: MetaDataGeneralKeyStringArray
  providerTypes: MetaDataGeneralKeyStringArray
  psps: MetaDataGeneralKeyStringArray
  sellers: MetaDataGeneralKeyStringArray
  tiers: GeneralMetaDataTiers
  user: {
    1: GeneralMetaDataUser
  }
  userPspAccountStatuses: MetaDataGeneralKeyStringValue
  userSettings: MetaDataGeneralKeyStringArray
  vatTypes: MetaDataGeneralKeyStringValue
  verificationStatuses: MetaDataGeneralKeyStringValue
  versions: MetaDataGeneralKeyStringValue
  verticals: MetaDataGeneralKeyStringValue
}

/* ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##
*
*    Merchant specific MetaData
*
*/

type MerchantMetaDataApproveActionReasonRequired = Record<number, MerchantMetaDataApproveActionReasonRequiredState>

type MerchantMetaDataApproveActionReasonRequiredState = {
  approve: boolean
  deny: boolean
  onhold: boolean
  unhold: boolean
}

export type MerchantMetaDataAuthorities = Record<number, Array<PaymentIqRoles>>

export enum PaymentIqRoles {
  ROLE_ADMIN_APPROVER = 'ROLE_ADMIN_APPROVER',
  ROLE_AGENT = 'ROLE_AGENT',
  ROLE_ANALYTICS = 'ROLE_ANALYTICS',
  ROLE_ANALYTICS_ADMIN = 'ROLE_ANALYTICS_ADMIN',
  ROLE_AUDIT_VIEWER = 'ROLE_AUDIT_VIEWER',
  ROLE_CONFIG_ADMIN = 'ROLE_CONFIG_ADMIN',
  ROLE_DATA_VIEWER = 'ROLE_DATA_VIEWER',
  ROLE_EDIT_USER_PSP_ACCOUNT = 'ROLE_EDIT_USER_PSP_ACCOUNT',
  ROLE_EXPERIMENTAL_FEATURES = 'ROLE_EXPERIMENTAL_FEATURES',
  ROLE_FIRST_APPROVER = 'ROLE_FIRST_APPROVER',
  ROLE_IIN_ADMIN = 'ROLE_IIN_ADMIN',
  ROLE_IIN = 'ROLE_IIN',
  ROLE_INVESTIGATOR = 'ROLE_INVESTIGATOR',
  ROLE_INVESTIGATOR_ADMIN = 'ROLE_INVESTIGATOR_ADMIN',
  ROLE_KYC = 'ROLE_KYC',
  ROLE_KYC_ADMIN = 'ROLE_KYC_ADMIN',
  ROLE_MAINTENANCE_ADMIN = 'ROLE_MAINTENANCE_ADMIN',
  ROLE_MAINTENANCE_SUPPORT = 'ROLE_MAINTENANCE_SUPPORT',
  ROLE_MERCHANT_ADMIN = 'ROLE_MERCHANT_ADMIN',
  ROLE_MERCHANT_SUPPORT = 'ROLE_MERCHANT_SUPPORT',
  ROLE_MERCHANT_USER_ENABLE = 'ROLE_MERCHANT_USER_ENABLE',
  ROLE_OPERATOR_ADMIN = 'ROLE_OPERATOR_ADMIN',
  ROLE_RULES = 'ROLE_RULES',
  ROLE_RULES_ADMIN = 'ROLE_RULES_ADMIN',
  ROLE_SECOND_APPROVER = 'ROLE_SECOND_APPROVER',
  ROLE_STORE = 'ROLE_STORE',
  ROLE_STORE_ADMIN = 'ROLE_STORE_ADMIN',
  ROLE_TRANSACTION_DETAIL_VIEWER = 'ROLE_TRANSACTION_DETAIL_VIEWER',
  ROLE_TRANSACTION_VIEWER = 'ROLE_TRANSACTION_VIEWER',
  ROLE_USER_PSP_ACCOUNT = 'ROLE_USER_PSP_ACCOUNT',
  ROLE_USER_PSP_ACCOUNT_ADMIN = 'ROLE_USER_PSP_ACCOUNT_ADMIN',
  ROLE_MINIBANK = 'ROLE_MINIBANK',
  ROLE_BAMBORA_OB_ADMIN = 'ROLE_BAMBORA_OB_ADMIN',
  ROLE_MINIBANK_ADMIN = 'ROLE_MINIBANK_ADMIN',
  ROLE_CUSTOMER = 'ROLE_CUSTOMER',
  ROLE_CUSTOMER_ADMIN = 'ROLE_CUSTOMER_ADMIN',
  ROLE_INVOICE_ADMIN = 'ROLE_INVOICE_ADMIN',
  ROLE_INVOICE = 'ROLE_INVOICE',
  ROLE_SETTLEMENTS = 'ROLE_SETTLEMENTS'
}

type MerchantMetaDataCustomers = Record<number, Array<MerchantMetaDataCustomer>>

type MerchantMetaDataCustomer = {
  companyName: string
  contactEmail: string
  contactName: string
  contactPhone: string
  country: string
  created: string
  erpCustomerId: string
  id: number
  licenses: string
  lifeCycle: string
  message: string
  name: string
  nextVersion: number
  paymentTerms: number
  pitaIndex: string
  regNo: string
  source: string
  status: string
  tier: string
  updated: string
  updatedBy: string
  validRegNo: true
  validVat: true
  vat: string
  vatType: string
  version: number
  vertical: number
}

type MerchantMetaDataDateranges = Record<number, MerchantMetaDataDaterange>

type MerchantMetaDataDaterange = {
  ['day-1']: string
  month: string
  ['month-1']: string
  now: string
  year: string
  ['year-1']: string
}

type MerchantMetaDataEsDashboards = Record<number, MerchantMetaDataEsDashboardsUseroverview>

type MerchantMetaDataEsDashboardsUseroverview = {
  enabled: boolean
  name: string
  path: string
  piqMerchantId: null|number|string
  query: string
  sharedDashboardRef: string
}

type MerchantMetaDataOidc = Record<MerchantId, MerchantMetaDataOidcItem>

type MerchantMetaDataOidcItem = {
  accountUrl: string
  issuer: string
}

type MerchantMetaDataTags = Record<number, MerchantMetaDataTag>

type MerchantMetaDataTag = {
  Approve: Array<MerchantMetaDataTagItem>
  Chargeback: Array<MerchantMetaDataTagItem>
  Deny: Array<MerchantMetaDataTagItem>
  ['On-Hold']: Array<MerchantMetaDataTagItem>
  Refund: Array<MerchantMetaDataTagItem>
  RequestForInfo: Array<MerchantMetaDataTagItem>
  Void: Array<MerchantMetaDataTagItem>
}

type MerchantMetaDataTagItem = {
  id: string
  name: string
}

type MerchantMetaDataUserPspAccountBlockReasons = Record<
  number,
  Array<MerchantMetaDataUserPspAccountBlockReasonsList>
>

enum MerchantMetaDataUserPspAccountBlockReasonsList {
  CHARGEBACK = 'Chargeback',
  // ['3RD_PARTY_CARD_NOT_AUTHORISED'] = '3rd Party Card - Not Authorised',
  BUSINESS_CARD = 'Business Card',
  CONFIRMED_FRAUD = 'Confirmed Fraud',
  SUSPECTED_FRAUD = 'Suspected Fraud',
  CUSTOMER_REQUEST = 'Customer Request',
  GAMBLING_PROBLEM = 'Gambling Problem',
  UK_SELF_EXCLUSION = 'UK Self-exclusion',
  SELF_EXCLUSION = 'Self-exclusion'
}

export type MerchantMetaData = {
  approveActionReasonRequired: MerchantMetaDataApproveActionReasonRequired
  authorities: MerchantMetaDataAuthorities
  availableLocales: MetaDataGeneralKeyStringValue
  availablePaymentTxTypes: MetaDataGeneralKeyStringValue
  availableProviderTypes: MetaDataGeneralKeyStringValue
  availablePsps: MetaDataGeneralKeyStringValue
  blockedWithinScope: MetaDataGeneralKeyBooleanValue
  boHasActiveEsRes: MetaDataGeneralKeyBooleanValue
  boReadingFromES: MetaDataGeneralKeyBooleanValue
  customers: MerchantMetaDataCustomers
  dateRanges: MerchantMetaDataDateranges
  detectDuplicateTxManualApproval: MetaDataGeneralKeyBooleanValue
  esDashboards: MerchantMetaDataEsDashboards
  externalUrls: MetaDataGeneralKeyStringArray
  oidc: MerchantMetaDataOidc
  pspsWithActiveDetectionOfManualApproval: MetaDataGeneralKeyStringArray
  tags: MerchantMetaDataTags
  userPresets: MetaDataGeneralKeyStringArray
  userPspAccountBlockReasons: MerchantMetaDataUserPspAccountBlockReasons
  userPspAccountExportEnabled: MetaDataGeneralKeyBooleanValue
  whitelistedAttributes: MetaDataGeneralKeyArbitraryObject
}
