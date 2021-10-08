import type {
  MenuItemHeader,
  MenuItemSubItemSections,
  MenuItem,
} from 'types/menu-items-types';
import { PaymentIqRoles as ROLES } from 'types/service/metadata';
import { Pages, RoutePaths, LegacyRoutePaths } from 'types/route-types';
import { hasValidRoles } from 'utils/helpers';
import pages from './all-pages';
import cloneDeep from 'lodash/cloneDeep';

const isMasterMerchant = true; // Change with real value
const hasAccessToMasterMerchant = true; // Change with real value

/*
 * @function (getMenuItems) - This function makes a deep filtering of sections and sub-sections based on roles.
 * It might be a bit messy and would need refactoring, but it's a deep filtering so a lot of loops were inescapable.
 * @returns (array) array with allowed paths, components and sections based on users roles.
 */
export const getMenuItems = (roles:ROLES[], homePage: boolean = false): MenuItemHeader[] => {
  // Need to clone menuSections() so we don't mutate the original object.
  const menuSectionsClone: MenuItemHeader[] = cloneDeep(homePage ? homePageSections() : menuSections());
  const sections = menuSectionsClone.filter((menuItem) => hasValidRoles(menuItem, roles));
  const filtered = sections.map((section) => {
    if (Object.prototype.hasOwnProperty.call(section, 'dropdownData')) {
      Object.entries(section.dropdownData || {}).forEach((s) => {
        if (!hasValidRoles(s[1] as MenuItemSubItemSections, roles)) {
          if (section.dropdownData) delete section.dropdownData[s[0]];
        } else if (section.dropdownData) {
          section.dropdownData[s[0]]!.items = s[1]!.items.filter((item) => hasValidRoles(item as MenuItem, roles));
          const filteredSubItems = section.dropdownData[s[0]]!.items.map((i) => {
            if (i.subItems) {
              i.subItems = i.subItems.filter((subItem) => hasValidRoles(subItem as MenuItem, roles));
            }
            return i;
          });
          section.dropdownData[s[0]]!.items = filteredSubItems;
        }
      });
    }
    return section;
  });

  // // This filters out "top" sections that have no children in it
  const sectionsWithChildrenOnly = filtered.filter((section) => {
    if (Object.prototype.hasOwnProperty.call(section, 'dropdownData') && section.dropdownData) {
      return Object.keys(section.dropdownData).length > 0;
    }
    return true;
  });
  return sectionsWithChildrenOnly;
};

const menuSections: () => MenuItemHeader[] = () => [
  home,
  transactions,
  approve,
  investigate,
  userAccounts,
  tools,
  finance,
  analytics,
  rules,
  admin,
];

const homePageSections: () => MenuItemHeader[] = () => [
  transactions,
  approve,
  investigate,
  userAccounts,
  tools,
  finance,
  analytics,
  rules,
  admin,
  backofficeUsers,
  resourceCenter,
];

const home = {
  label: 'Home',
  toPath: RoutePaths.HOME,
  legacyPath: LegacyRoutePaths.HOME,
  id: Pages.HOME,
  validRoles: null,
  cmpnt: pages.Home,
  icon: 'dashboard',
};

const transactions = {
  label: 'Transactions',
  description: 'Search for transactions processed through PaymentIQ.',
  toPath: RoutePaths.TRANSACTIONS,
  legacyPath: LegacyRoutePaths.TRANSACTIONS,
  id: Pages.TRANSACTIONS,
  validRoles: [
    ROLES.ROLE_TRANSACTION_VIEWER,
    ROLES.ROLE_TRANSACTION_DETAIL_VIEWER,
  ],
  invalidRoles: [],
  cmpnt: pages.Transactions,
  icon: 'exchange',
};

const approve = {
  label: 'Approve',
  description: 'See pending withdrawal requests, approve withdrawals and send money to the customers.',
  toPath: RoutePaths.APPROVE,
  legacyPath: LegacyRoutePaths.APPROVE,
  id: Pages.APPROVE,
  validRoles: [
    ROLES.ROLE_MERCHANT_ADMIN,
    ROLES.ROLE_MERCHANT_SUPPORT,
    ROLES.ROLE_FIRST_APPROVER,
    ROLES.ROLE_SECOND_APPROVER,
    ROLES.ROLE_ADMIN_APPROVER,
  ],
  cmpnt: pages.Approve,
  icon: 'clipboard check',
};

const investigate = {
  label: 'Investigate',
  description: 'Manage transaction state, assist with refunds and corrections.',
  toPath: RoutePaths.INVESTIGATE,
  legacyPath: LegacyRoutePaths.INVESTIGATE,
  id: Pages.INVESTIGATE,
  validRoles: [ROLES.ROLE_INVESTIGATOR_ADMIN, ROLES.ROLE_INVESTIGATOR],
  cmpnt: pages.Investigate,
  icon: 'searchengin',
};

const userAccounts = {
  label: 'User accounts',
  description: 'Edit accounts, activate, inactivate or even block.',
  toPath: RoutePaths.USER_ACCOUNTS,
  legacyPath: LegacyRoutePaths.USER_ACCOUNTS,
  id: Pages.USER_ACCOUNTS,
  validRoles: [ROLES.ROLE_USER_PSP_ACCOUNT, ROLES.ROLE_USER_PSP_ACCOUNT_ADMIN],
  cmpnt: pages.UserAccounts,
  icon: 'users',
};

const tools = {
  label: 'Tools',
  description: 'Search, Block, Routing and Fallback.',
  id: Pages.TOOLS,
  validRoles: [
    ROLES.ROLE_MERCHANT_ADMIN,
    ROLES.ROLE_MERCHANT_SUPPORT,
    ROLES.ROLE_FIRST_APPROVER,
    ROLES.ROLE_SECOND_APPROVER,
    ROLES.ROLE_ADMIN_APPROVER,
    ROLES.ROLE_KYC,
    ROLES.ROLE_KYC_ADMIN,
    ROLES.ROLE_STORE_ADMIN,
  ],
  icon: 'box',
  dropdownData: {
    sectionOne: {
      label: null,
      validRoles: [
        ROLES.ROLE_MERCHANT_ADMIN,
        ROLES.ROLE_MERCHANT_SUPPORT,
        ROLES.ROLE_FIRST_APPROVER,
        ROLES.ROLE_SECOND_APPROVER,
        ROLES.ROLE_ADMIN_APPROVER,
      ],
      items: [
        {
          label: 'KYC',
          id: Pages.KYC,
          validRoles: [ROLES.ROLE_KYC, ROLES.ROLE_KYC_ADMIN],
          subItems: [
            {
              label: 'Search',
              toPath: RoutePaths.TOOLS_KYC_SEARCH,
              legacyPath: LegacyRoutePaths.TOOLS_KYC_SEARCH,
              id: Pages.TOOLS_KYC_SEARCH,
              validRoles: null,
              cmpnt: pages.KycSearch,
            },
            {
              label: 'Block',
              toPath: RoutePaths.TOOLS_KYC_BLOCK,
              legacyPath: LegacyRoutePaths.TOOLS_KYC_BLOCK,
              id: Pages.TOOLS_KYC_BLOCK,
              validRoles: null,
              cmpnt: pages.KycBlock,
            },
            {
              label: 'Routing - KYC',
              toPath: RoutePaths.TOOLS_KYC_ROUTING,
              legacyPath: LegacyRoutePaths.TOOLS_KYC_ROUTING,
              id: Pages.TOOLS_KYC_ROUTING,
              validRoles: null,
              cmpnt: pages.KycRouting,
            },
            {
              label: 'Fallback - KYC',
              toPath: RoutePaths.TOOLS_KYC_FALLBACK,
              legacyPath: LegacyRoutePaths.TOOLS_KYC_FALLBACK,
              id: Pages.TOOLS_KYC_FALLBACK,
              validRoles: null,
              cmpnt: pages.KycFallback,
            },
          ],
        },
        {
          label: 'Store',
          id: Pages.STORE,
          validRoles: [ROLES.ROLE_STORE_ADMIN],
          subItems: [
            {
              label: 'Product',
              toPath: RoutePaths.TOOLS_STORE_PRODUCT,
              legacyPath: LegacyRoutePaths.TOOLS_STORE_PRODUCT,
              id: Pages.TOOLS_STORE_PRODUCT,
              validRoles: null,
              cmpnt: pages.Product,
            },
            {
              label: 'Voucher',
              toPath: RoutePaths.TOOLS_STORE_VOUCHER,
              legacyPath: LegacyRoutePaths.TOOLS_STORE_VOUCHER,
              id: Pages.TOOLS_STORE_VOUCHER,
              validRoles: null,
              cmpnt: pages.Voucher,
            },
          ],
        },
      ],
    },
  },
};

const finance = {
  label: 'Finance',
  id: Pages.FINANCE,
  validRoles: [ROLES.ROLE_SETTLEMENTS],
  icon: 'briefcase',
  dropdownData: {
    sectionOne: {
      label: null,
      validRoles: null,
      items: [
        {
          label: 'Settlements',
          toPath: RoutePaths.FINANCE_SETTLEMENTS,
          legacyPath: LegacyRoutePaths.FINANCE_SETTLEMENTS,
          id: Pages.FINANCE_SETTLEMENTS,
          validRoles: null,
          cmpnt: pages.Settlements,
        },
        {
          label: 'Balance',
          toPath: RoutePaths.FINCANCE_BALANCE,
          legacyPath: LegacyRoutePaths.FINCANCE_BALANCE,
          id: Pages.FINCANCE_BALANCE,
          validRoles: null,
          cmpnt: pages.Balance,
        },
      ],
    },
  },
};

const analytics = {
  label: 'Analytics',
  description: 'Deep metrics and strong query capabilities.',
  id: Pages.ANALYTICS,
  validRoles: null,
  icon: 'chart bar',
  dropdownData: {
    sectionOne: {
      label: 'Default',
      validRoles: [ROLES.ROLE_ANALYTICS],
      items: [
        {
          label: 'Acceptance rate overview',
          toPath: RoutePaths.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW,
          legacyPath: LegacyRoutePaths.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW,
          id: Pages.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW,
          validRoles: null,
          cmpnt: pages.AcceptanceRateOverview,
        },
        {
          label: 'Acceptance rate overview-MJ',
          toPath: RoutePaths.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW_MJ,
          legacyPath: LegacyRoutePaths.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW_MJ,
          id: Pages.ANALYTICS_ACCEPTANCE_RATE_OVERVIEW_MJ,
          validRoles: null,
          cmpnt: pages.AcceptanceRateOverviewMj,
        },
        {
          label: 'Drilldown users',
          toPath: RoutePaths.ANALYTICS_DRILLDOWN_USERS,
          legacyPath: LegacyRoutePaths.ANALYTICS_DRILLDOWN_USERS,
          id: Pages.ANALYTICS_DRILLDOWN_USERS,
          validRoles: null,
          cmpnt: pages.DrilldownUsers,
        },
        {
          label: 'Geographical overview',
          toPath: RoutePaths.ANALYTICS_GEOGRAPHICAL_OVERVIEW,
          legacyPath: LegacyRoutePaths.ANALYTICS_GEOGRAPHICAL_OVERVIEW,
          id: Pages.ANALYTICS_GEOGRAPHICAL_OVERVIEW,
          validRoles: null,
          cmpnt: pages.GeographicalOverview,
        },
        {
          label: 'User overview',
          toPath: RoutePaths.ANALYTICS_USER_OVERVIEW,
          legacyPath: LegacyRoutePaths.ANALYTICS_USER_OVERVIEW,
          id: Pages.ANALYTICS_USER_OVERVIEW,
          validRoles: null,
          cmpnt: pages.UserOverview,
        },
      ],
    },
  },
};

const rules = {
  label: 'Rules',
  description: 'Adjust the fee for credit cards or set the limit.',
  id: Pages.RULES,
  validRoles: [ROLES.ROLE_RULES, ROLES.ROLE_RULES_ADMIN],
  icon: 'clipboard list',
  dropdownData: {
    sectionOne: {
      label: null,
      validRoles: null,
      items: [
        {
          label: 'Routing',
          id: Pages.ROUTING,
          validRoles: null,
          subItems: [
            {
              label: 'Routing',
              id: Pages.RULES_ROUTING_ROUTING,
              toPath: RoutePaths.RULES_ROUTING_ROUTING,
              legacyPath: LegacyRoutePaths.RULES_ROUTING_ROUTING,
              validRoles: null,
              cmpnt: pages.Routing,
            },
            {
              label: 'Routing - Fallback',
              id: Pages.RULES_ROUTING_FALLBACK,
              toPath: RoutePaths.RULES_ROUTING_FALLBACK,
              legacyPath: LegacyRoutePaths.RULES_ROUTING_FALLBACK,
              validRoles: null,
              cmpnt: pages.Fallback,
            },
            {
              label: 'Fraud provider',
              id: Pages.RULES_ROUTING_FRAUD_PROVIDER,
              toPath: RoutePaths.RULES_ROUTING_FRAUD_PROVIDER,
              legacyPath: LegacyRoutePaths.RULES_ROUTING_FRAUD_PROVIDER,
              validRoles: null,
              cmpnt: pages.FraudProvider,
            },
            {
              label: '3DS2 Routing',
              id: Pages.RULES_ROUTING_3DS2_ROUTING,
              toPath: RoutePaths.RULES_ROUTING_3DS2_ROUTING,
              legacyPath: LegacyRoutePaths.RULES_ROUTING_3DS2_ROUTING,
              validRoles: null,
              cmpnt: pages.Routing3ds2,
            },
            {
              label: '3DS2 Fallback',
              id: Pages.RULES_ROUTING_3DS2_FALLBACK,
              toPath: RoutePaths.RULES_ROUTING_3DS2_FALLBACK,
              legacyPath: LegacyRoutePaths.RULES_ROUTING_3DS2_FALLBACK,
              validRoles: null,
              cmpnt: pages.Fallback3ds2,
            },
          ],
        },
        {
          label: 'Fees',
          id: Pages.FEES,
          validRoles: null,
          subItems: [
            {
              label: 'Fee',
              id: Pages.RULES_FEES_FEE,
              toPath: RoutePaths.RULES_FEES_FEE,
              legacyPath: LegacyRoutePaths.RULES_FEES_FEE,
              validRoles: null,
              cmpnt: pages.Fee,
            },
            {
              label: 'Provider Fee',
              id: Pages.RULES_FEES_PROVIDER_FEE,
              toPath: RoutePaths.RULES_FEES_PROVIDER_FEE,
              legacyPath: LegacyRoutePaths.RULES_FEES_PROVIDER_FEE,
              validRoles: null,
              cmpnt: pages.ProviderFee,
            },
          ],
        },
        {
          label: 'Limit',
          toPath: RoutePaths.RULES_LIMIT,
          id: Pages.LIMIT,
          validRoles: null,
          cmpnt: pages.Limit,
        },
        {
          label: 'Fraud blocks',
          id: Pages.FRAUD_BLOCKS,
          validRoles: null,
          subItems: [
            {
              label: 'General block',
              id: Pages.RULES_FRAUD_BLOCKS_GENERAL_BLOCK,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_GENERAL_BLOCK,
              validRoles: null,
              cmpnt: pages.GeneralBlock,
            },
            {
              label: 'IP block',
              id: Pages.RULES_FRAUD_BLOCKS_IP_BLOCK,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_IP_BLOCK,
              validRoles: null,
              cmpnt: pages.IpBlock,
            },
            {
              label: 'BIN block',
              id: Pages.RULES_FRAUD_BLOCKS_BIN_BLOCK,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_BIN_BLOCK,
              validRoles: null,
              cmpnt: pages.BinBlock,
            },
            {
              label: 'Velocity',
              id: Pages.RULES_FRAUD_BLOCKS_VELOCITY,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_VELOCITY,
              validRoles: null,
              cmpnt: pages.Velocity,
            },
            {
              label: 'User PSP Account',
              id: Pages.RULES_FRAUD_BLOCKS_USER_PSP_ACCOUNT,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_USER_PSP_ACCOUNT,
              validRoles: null,
              cmpnt: pages.UserPspAccount,
            },
            {
              label: 'Fraud Provider Block',
              id: Pages.RULES_FRAUD_BLOCKS_FRAUD_PROVIDER_BLOCK,
              toPath: RoutePaths.RULES_FRAUD_BLOCKS_FRAUD_PROVIDER_BLOCK,
              validRoles: null,
              cmpnt: pages.FraudProviderBlock,
            },
          ],
        },
        {
          label: 'Forex',
          id: Pages.RULES_FOREX,
          toPath: RoutePaths.RULES_FOREX,
          validRoles: null,
          cmpnt: pages.RulesForex,
        },
        {
          label: 'Status code',
          id: Pages.RULES_STATUS_CODE,
          toPath: RoutePaths.RULES_STATUS_CODE,
          validRoles: null,
          cmpnt: pages.StatusCode,
        },
        {
          label: 'Payment methods',
          id: Pages.RULES_PAYMENT_METHODS,
          toPath: RoutePaths.RULES_PAYMENT_METHODS,
          validRoles: null,
          cmpnt: pages.PaymentMethods,
        },
        {
          label: 'Alerts',
          id: Pages.RULES_ALERTS,
          toPath: RoutePaths.RULES_ALERTS,
          validRoles: null,
          cmpnt: pages.Alerts,
        },
        {
          label: 'Notification',
          id: Pages.RULES_NOTIFICATION,
          toPath: RoutePaths.RULES_NOTIFICATION,
          validRoles: null,
          cmpnt: pages.Notification,
        },
        {
          label: 'Approval',
          id: Pages.RULES_APPROVAL,
          toPath: RoutePaths.RULES_APPROVAL,
          validRoles: null,
          cmpnt: pages.Approval,
        },
      ],
    },
    sectionTwo: {
      label: null,
      validRoles: null,
      items: [
        {
          label: 'Vat',
          id: Pages.RULES_VAT,
          toPath: RoutePaths.RULES_VAT,
          validRoles: [ROLES.ROLE_STORE_ADMIN],
          cmpnt: pages.Vat,
        },
        {
          label: 'Void/Capture',
          id: Pages.RULES_VOID_CAPTURE,
          toPath: RoutePaths.RULES_VOID_CAPTURE,
          validRoles: null,
          cmpnt: pages.VoidCapture,
        },
      ],
    },
  },
};

const admin = {
  label: 'Admin',
  description: 'Edit the settings for PaymentIQ and make it yours!',
  id: Pages.ADMIN,
  validRoles: null,
  icon: 'key',
  dropdownData: {
    sectionOne: {
      label: null,
      validRoles: null,
      items: [
        {
          label: 'Backoffice Users',
          id: Pages.ADMIN_BO_USERS,
          toPath: RoutePaths.ADMIN_BO_USERS,
          validRoles: [
            ROLES.ROLE_MERCHANT_ADMIN,
            ROLES.ROLE_MERCHANT_USER_ENABLE,
          ],
          cmpnt: pages.BackofficeUsers,
        },
        {
          label: 'Audit Log',
          id: Pages.ADMIN_AUDIT_LOG,
          toPath: RoutePaths.ADMIN_AUDIT_LOG,
          validRoles: [ROLES.ROLE_AUDIT_VIEWER],
          cmpnt: pages.AuditLog,
        },
        {
          label: 'Configuration',
          id: Pages.ADMIN_CONFIGURATION,
          toPath: RoutePaths.ADMIN_CONFIGURATION,
          validRoles: [ROLES.ROLE_CONFIG_ADMIN],
          cmpnt: pages.Configuration,
        },
        {
          label: 'Merchant',
          id: Pages.ADMIN_MERCHANT,
          toPath: RoutePaths.ADMIN_MERCHANT,
          validRoles: [ROLES.ROLE_OPERATOR_ADMIN],
          isAllowed: hasAccessToMasterMerchant,
          cmpnt: pages.Merchant,
        },
        {
          label: 'Maintenance',
          id: Pages.ADMIN_MAINTENANCE,
          toPath: RoutePaths.ADMIN_MAINTENANCE,
          validRoles: [
            ROLES.ROLE_MAINTENANCE_SUPPORT,
            ROLES.ROLE_MAINTENANCE_ADMIN,
          ],
          cmpnt: pages.Maintenance,
        },
        {
          label: 'API Clients',
          id: Pages.ADMIN_API_CLIENTS,
          toPath: RoutePaths.ADMIN_API_CLIENTS,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          cmpnt: pages.ApiClients,
        },
        {
          label: 'Invoice',
          id: Pages.ADMIN_INVOICE,
          toPath: RoutePaths.ADMIN_INVOICE,
          validRoles: [ROLES.ROLE_INVOICE_ADMIN, ROLES.ROLE_INVOICE],
          isAllowed: hasAccessToMasterMerchant,
          cmpnt: pages.Invoice,
        },
        {
          label: 'Customer',
          id: Pages.ADMIN_CUSTOMER,
          toPath: RoutePaths.ADMIN_CUSTOMER,
          validRoles: [ROLES.ROLE_CUSTOMER_ADMIN, ROLES.ROLE_CUSTOMER],
          cmpnt: pages.Customer,
        },
        {
          label: 'Templates',
          id: Pages.TEMPLATES,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          subItems: [
            {
              label: 'Email Templates',
              id: Pages.ADMIN_TEMPLATES_EMAIL,
              toPath: RoutePaths.ADMIN_TEMPLATES_EMAIL,
              validRoles: null,
              cmpnt: pages.EmailTemplates,
            },
            {
              label: 'Script Templates',
              id: Pages.ADMIN_TEMPLATES_SCRIPT,
              toPath: RoutePaths.ADMIN_TEMPLATES_SCRIPT,
              validRoles: [ROLES.ROLE_OPERATOR_ADMIN],
              cmpnt: pages.ScriptTemplates,
            },
            {
              label: 'HTML Templates',
              id: Pages.ADMIN_TEMPLATES_HTML,
              toPath: RoutePaths.ADMIN_TEMPLATES_HTML,
              validRoles: null,
              cmpnt: pages.HtmlTemplates,
              setShowLegacy: false,
            },
            {
              label: 'SQL Templates',
              id: Pages.ADMIN_TEMPLATES_SQL,
              toPath: RoutePaths.ADMIN_TEMPLATES_SQL,
              validRoles: [ROLES.ROLE_OPERATOR_ADMIN],
              cmpnt: pages.SqlTemplates,
            },
            {
              label: 'MQ Templates',
              id: Pages.ADMIN_TEMPLATES_MQ,
              toPath: RoutePaths.ADMIN_TEMPLATES_MQ,
              validRoles: null,
              cmpnt: pages.MqTemplates,
            },
            {
              label: 'CSS Templates',
              id: Pages.ADMIN_TEMPLATES_CSS,
              toPath: RoutePaths.ADMIN_TEMPLATES_CSS,
              validRoles: null,
              cmpnt: pages.CssTemplates,
            },
          ],
        },
        {
          label: 'Messages',
          id: Pages.ADMIN_MESSAGES,
          toPath: RoutePaths.ADMIN_MESSAGES,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          cmpnt: pages.Messages,
        },
        {
          label: 'PSP Icons',
          id: Pages.ADMIN_PSP_ICONS,
          toPath: RoutePaths.ADMIN_PSP_ICONS,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          cmpnt: pages.PspIcons,
        },
        {
          label: 'Forex',
          id: Pages.ADMIN_FOREX,
          toPath: RoutePaths.ADMIN_FOREX,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          cmpnt: pages.AdminForex,
        },
        {
          label: 'IIN',
          id: Pages.ADMIN_IIN,
          toPath: RoutePaths.ADMIN_IIN,
          validRoles: [ROLES.ROLE_IIN, ROLES.ROLE_IIN_ADMIN],
          cmpnt: pages.Iin,
        },
        {
          label: 'Bank Mapping',
          id: Pages.ADMIN_BANK_MAPPING,
          toPath: RoutePaths.ADMIN_BANK_MAPPING,
          validRoles: [ROLES.ROLE_MERCHANT_ADMIN],
          isAllowed: isMasterMerchant,
          cmpnt: pages.BankMapping,
        },
        {
          label: 'Resource Center',
          id: Pages.ADMIN_RESOURCE_CENTER,
          toPath: RoutePaths.ADMIN_RESOURCE_CENTER,
          validRoles: null,
          cmpnt: pages.ResourceCenter,
        },
      ],
    },
  },
};

const backofficeUsers = {
  label: 'Back-office Users',
  description: 'Set up a new user or remove access for someone who\'s left the company. Reset the password for a colleague.',
  id: Pages.ADMIN_BO_USERS,
  toPath: RoutePaths.ADMIN_BO_USERS,
  validRoles: [
    ROLES.ROLE_MERCHANT_ADMIN,
    ROLES.ROLE_MERCHANT_USER_ENABLE,
  ],
  icon: 'key',
  cmpnt: pages.BackofficeUsers,
};

const resourceCenter = {
  label: 'Resource Center',
  description: 'Read the manuals about PaymentIQ.',
  id: Pages.ADMIN_RESOURCE_CENTER,
  validRoles: null,
  toPath: RoutePaths.ADMIN_RESOURCE_CENTER,
  icon: 'key',
  cmpnt: pages.ResourceCenter,
};
