/* eslint-disable */
// Creating and writing files conditionally

// When we have custom functionality for pages that are no longer fetching leg-bo we wanna add them to exclude.
exports.exclude = [
  'CssTemplates',
  'EmailTemplates',
  'HtmlTemplates',
  'MqTemplates',
  'ScriptTemplates',
  'SqlTemplates'
]

/*
 * hashpath - Matches the corresponding path in bo-legacy who has a hash type of path
 * name - Should match the filename without the extension part.
 */
exports.pageData = [
  {
    hashpath: '/#analytics',
    name: 'AcceptanceRateOverview'
  },
  {
    hashpath: '#/T21-decisiontable/read/',
    name: 'FraudProvider'
  },
  {
    hashpath: '/#T12-decisiontable/read/',
    name: 'PaymentMethods'
  },
  {
    hashpath: '/#analytics',
    name: 'AcceptanceRateOverviewMj'
  },
  {
    hashpath: '/#T24-decisiontable/read/',
    name: 'FraudProviderBlock'
  },
  {
    hashpath: '/#product/read/',
    name: 'Product'
  },
  {
    hashpath: '#/forex',
    name: 'AdminForex'
  },
  {
    hashpath: '/#T27-decisiontable/read/',
    name: 'GeneralBlock'
  },
  {
    hashpath: '/#T20-decisiontable/read/',
    name: 'ProviderFee'
  },
  {
    hashpath: '/#T13-decisiontable/read/',
    name: 'Alerts'
  },
  {
    hashpath: '/#analytics',
    name: 'GeographicalOverview'
  },
  {
    hashpath: '/#resourceCenter/read',
    name: 'ResourceCenter'
  },
  {
    hashpath: '/#adminapiclient/search',
    name: 'ApiClients'
  },
  { hashpath: '/#start', name: 'Home' },
  {
    hashpath: '/#T3-decisiontable/read/',
    name: 'Routing'
  },
  {
    hashpath: '/#T18-decisiontable/read/',
    name: 'Approval'
  },
  {
    hashpath: '/#htmltemplate/read/',
    name: 'HtmlTemplates'
  },
  {
    hashpath: '/#T28-decisiontable/read/',
    name: 'Routing3ds2'
  },
  {
    hashpath: '/#approve/search/',
    name: 'Approve'
  },
  { hashpath: '/#issuerinfo/search/', name: 'Iin' },
  {
    hashpath: '/#T8-decisiontable/read/',
    name: 'RulesForex'
  },
  { hashpath: null, name: 'AuditLog' },
  {
    hashpath: '/#investigate/search/',
    name: 'Investigate'
  },
  {
    hashpath: '/#scripttemplate/read/',
    name: 'ScriptTemplates'
  },
  {
    hashpath: '/#user',
    name: 'BackofficeUsers'
  },
  { hashpath: null, name: 'Invoice' },
  { hashpath: null, name: 'Settlements' },
  { hashpath: null, name: 'Balance' },
  {
    hashpath: '/#T1-decisiontable/read/',
    name: 'IpBlock'
  },
  {
    hashpath: '/#sqltemplate/read/',
    name: 'SqlTemplates'
  },
  {
    hashpath: '/#bankmapping/search/',
    name: 'BankMapping'
  },
  {
    hashpath: '/#T16-decisiontable/read/',
    name: 'KycBlock'
  },
  {
    hashpath: '/#T11-decisiontable/read/',
    name: 'StatusCode'
  },
  {
    hashpath: '/#T2-decisiontable/read/',
    name: 'BinBlock'
  },
  {
    hashpath: '/#T22-decisiontable/read/',
    name: 'KycFallback'
  },
  {
    hashpath: '/#transaction/search/',
    name: 'Transactions'
  },
  {
    hashpath: '/#config/read/',
    name: 'Configuration'
  },
  {
    hashpath: '/#T15-decisiontable/read/',
    name: 'KycRouting'
  },
  {
    hashpath: '/#user-psp-accounts/search/',
    name: 'UserAccounts'
  },
  {
    hashpath: '/#csstemplate/read/',
    name: 'CssTemplates'
  },
  {
    hashpath: '/#kyc/search/',
    name: 'KycSearch'
  },
  {
    hashpath: '/#analytics',
    name: 'UserOverview'
  },
  { hashpath: null, name: 'Customer' },
  {
    hashpath: '/#T5-decisiontable/read/',
    name: 'Limit'
  },
  {
    hashpath: '/#T19-decisiontable/read/',
    name: 'UserPspAccount'
  },
  {
    hashpath: '/#analytics',
    name: 'DrilldownUsers'
  },
  {
    hashpath: '/#maintenance/search',
    name: 'Maintenance'
  },
  {
    hashpath: '/#T10-decisiontable/read/',
    name: 'Vat'
  },
  {
    hashpath: '/#emailtemplate/read/',
    name: 'EmailTemplates'
  },
  {
    hashpath: '/#merchant/search',
    name: 'Merchant'
  },
  {
    hashpath: '/#T7-decisiontable/read/',
    name: 'Velocity'
  },
  {
    hashpath: '/#T22-decisiontable/read/',
    name: 'Fallback'
  },
  {
    hashpath: '/#i18nMessageGrid',
    name: 'Messages'
  },
  {
    hashpath: '/#T26-decisiontable/read/',
    name: 'VoidCapture'
  },
  {
    hashpath: '/#T29-decisiontable/read/',
    name: 'Fallback3ds2'
  },
  {
    hashpath: '/#mqtemplate/read/',
    name: 'MqTemplates'
  },
  {
    hashpath: '/#voucher/read/',
    name: 'Voucher'
  },
  {
    hashpath: '/#T4-decisiontable/read/',
    name: 'Fee'
  },
  {
    hashpath: '/#T14-decisiontable/read/',
    name: 'Notification'
  }
]
