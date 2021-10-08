import { lazy } from 'react';

const Home = lazy(() => import('pages/Home'));
const Transactions = lazy(() => import('pages/Transactions'));
const Approve = lazy(() => import('pages/Approve'));
const Investigate = lazy(() => import('pages/Investigate'));

const Settlements = lazy(() => import('pages/Settlements'));
const Balance = lazy(() => import('pages/Balance'));
const UserAccounts = lazy(() => import('pages/UserAccounts'));
const AcceptanceRateOverview = lazy(() => import('pages/AcceptanceRateOverview'));
const AcceptanceRateOverviewMj = lazy(() => import('pages/AcceptanceRateOverviewMj'));
const VoidCapture = lazy(() => import('pages/VoidCapture'));
const Vat = lazy(() => import('pages/Vat'));
const DrilldownUsers = lazy(() => import('pages/DrilldownUsers'));
const GeographicalOverview = lazy(() => import('pages/GeographicalOverview'));
const UserOverview = lazy(() => import('pages/UserOverview'));
const KycSearch = lazy(() => import('pages/KycSearch'));
const KycBlock = lazy(() => import('pages/KycBlock'));
const Routing = lazy(() => import('pages/Routing'));
const Fallback = lazy(() => import('pages/Fallback'));
const Product = lazy(() => import('pages/Product'));
const Voucher = lazy(() => import('pages/Voucher'));
const KycRouting = lazy(() => import('pages/KycRouting'));
const KycFallback = lazy(() => import('pages/KycFallback'));
const FraudProvider = lazy(() => import('pages/FraudProvider'));
const Routing3ds2 = lazy(() => import('pages/Routing3ds2'));
const Fallback3ds2 = lazy(() => import('pages/Fallback3ds2'));
const Fee = lazy(() => import('pages/Fee'));
const ProviderFee = lazy(() => import('pages/ProviderFee'));
const Limit = lazy(() => import('pages/Limit'));
const GeneralBlock = lazy(() => import('pages/GeneralBlock'));
const IpBlock = lazy(() => import('pages/IpBlock'));
const BinBlock = lazy(() => import('pages/BinBlock'));
const Velocity = lazy(() => import('pages/Velocity'));
const UserPspAccount = lazy(() => import('pages/UserPspAccount'));
const FraudProviderBlock = lazy(() => import('pages/FraudProviderBlock'));
const StatusCode = lazy(() => import('pages/StatusCode'));
const PaymentMethods = lazy(() => import('pages/PaymentMethods'));
const Alerts = lazy(() => import('pages/Alerts'));
const Notification = lazy(() => import('pages/Notification'));
const Approval = lazy(() => import('pages/Approval'));
const BackofficeUsers = lazy(() => import('pages/BackofficeUsers'));
const AuditLog = lazy(() => import('pages/AuditLog'));
const Configuration = lazy(() => import('pages/Configuration'));
const Merchant = lazy(() => import('pages/Merchant'));
const Maintenance = lazy(() => import('pages/Maintenance'));
const ApiClients = lazy(() => import('pages/ApiClients'));
const Invoice = lazy(() => import('pages/Invoice'));
const Customer = lazy(() => import('pages/Customer'));

/* Templates */
const EmailTemplates = lazy(() => import('pages/templates/EmailTemplates'));
const ScriptTemplates = lazy(() => import('pages/templates/ScriptTemplates'));
const HtmlTemplates = lazy(() => import('pages/templates/HtmlTemplates'));
const SqlTemplates = lazy(() => import('pages/templates/SqlTemplates'));
const MqTemplates = lazy(() => import('pages/templates/MqTemplates'));
const CssTemplates = lazy(() => import('pages/templates/CssTemplates'));

/* Admin */
const Messages = lazy(() => import('pages/Messages'));
const AdminForex = lazy(() => import('pages/AdminForex'));
const PspIcons = lazy(() => import('pages/PspIcons'));
const RulesForex = lazy(() => import('pages/RulesForex'));
const Iin = lazy(() => import('pages/Iin'));
const BankMapping = lazy(() => import('pages/BankMapping'));
const ResourceCenter = lazy(() => import('pages/ResourceCenter'));

const allPages = {
  Home,
  Transactions,
  Approve,
  Investigate,
  Settlements,
  Balance,
  UserAccounts,
  AcceptanceRateOverview,
  AcceptanceRateOverviewMj,
  VoidCapture,
  Vat,
  DrilldownUsers,
  GeographicalOverview,
  UserOverview,
  KycSearch,
  KycBlock,
  KycRouting,
  KycFallback,
  Routing,
  Fallback,
  Product,
  Voucher,
  FraudProvider,
  Routing3ds2,
  Fallback3ds2,
  Fee,
  ProviderFee,
  Limit,
  GeneralBlock,
  IpBlock,
  BinBlock,
  Velocity,
  UserPspAccount,
  FraudProviderBlock,
  StatusCode,
  PaymentMethods,
  Alerts,
  Notification,
  Approval,
  BackofficeUsers,
  AuditLog,
  Configuration,
  Merchant,
  Maintenance,
  ApiClients,
  Invoice,
  Customer,
  EmailTemplates,
  ScriptTemplates,
  HtmlTemplates,
  SqlTemplates,
  MqTemplates,
  CssTemplates,
  Messages,
  AdminForex,
  PspIcons,
  RulesForex,
  Iin,
  BankMapping,
  ResourceCenter,
};

export default allPages;
