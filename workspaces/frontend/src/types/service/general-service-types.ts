export interface MerchantSummary {
  result: null | [
    {
      id: string,
      dbId: number,
      name: string,
      enabled: boolean,
      currentRuleId: number,
      prio: number,
      displayId: string,
      ruleIdPrefix: string,
      version: number,
      helpText: any
    }
  ],
  message: any,
  total: number,
  success: boolean,
  errors: null
}

export interface MerchantPaymentMethodsRulesConditions {
  id: string,
  multiSelect: boolean,
  value: string,
  visibleByDefault: boolean,
  required: boolean,
  operator: string
}

export interface MerchantPaymentMethodsRulesActions {
  id: string,
  multiSelect: boolean,
  value: string,
  visibleByDefault: boolean,
  required: boolean,
  operator: string
}

export interface MerchantPaymentMethodsRules {
  id: string,
  merchantId: number,
  name: string,
  note: any,
  decisionTableId: string,
  enabled: boolean,
  conditions: null|Array<MerchantPaymentMethodsRulesConditions>,
  actions: null|Array<MerchantPaymentMethodsRulesActions>,
}

export interface MerchantPaymentMethods {
  result: null|{
    id: string,
    merchantId: number,
    dbId: number,
    name: string,
    enabled: boolean,
    rules: null|Array<MerchantPaymentMethodsRules>,
    prio: number,
    displayId: string,
    ruleIdPrefix: string,
    currentRuleId: number,
    preconditions: Array<any>,
    version: number,
    updatedBy: string,
    updated: string,
    message: string,
    event: string
  },
  message: any,
  total: any,
  success: boolean,
  errors: any
}

export interface MessageResult {
  category: string
  defaultMessage: boolean
  defaultValue: string
  value: string
  description: string
  id: number
  key: string
  lastUpdated: string
  locale: string
  merchantId: number
}

export interface MerchantMessages {
  errors: null|any,
  message: null|any,
  result: null|Array<MessageResult>,
  success: boolean,
  total: number
}

export interface MerchantMessagesPayload {
  category: string,
  description: string,
  gridId: number|string, // same as ID
  id: number
  key: string
  locale: string
  value: string
}
