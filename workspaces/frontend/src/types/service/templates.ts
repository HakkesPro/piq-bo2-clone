import type { MerchantId } from 'types/global-types';

export interface FetchTemplatesParameters {
  merchantId: MerchantId,
  type: TemplateApiTypes
}

export interface FetchTemplateHistoryParameters {
  merchantId: MerchantId,
  templateType: TemplateApiTypes,
  limit?: string
}

export interface CreateTemplateParameters {
  merchantId: MerchantId,
  payload: Partial<Template>
}

export interface UpdateTemplateParameters {
  merchantId: MerchantId,
  payload: Partial<Template>
}

export interface DeleteTemplateParameters {
  merchantId: MerchantId,
  templateId: number
}

export interface TemplateBaseResponse {
  errors: null,
  message: null,
  success: boolean,
  total: number,
}

export interface TemplateResponse extends TemplateBaseResponse {
  result: Template[]
}

export interface TemplateHistoryResponse extends TemplateBaseResponse {
  result: Template[]
}

export interface CreateUpdateTemplateResponse extends TemplateBaseResponse {
  result: Template
}

export interface Template {
  channel: string,
  created: string|null,
  event: string|null,
  id: number,
  locale: string | null,
  message: string | null,
  name: string,
  nextVersion: number,
  type: TemplateTypes | TemplateApiTypes,
  updated: string,
  updatedBy: string,
  values: {
    url?: string,
    body: string,
    htmlBody?: string,
    subject?: string
  },
  version: number
}

export interface SortedRecentTemplates {
  allRecent: Template[]|null,
  yourRecent: Template[]|null,
  othersRecent: Template[]|null
}

// Used to set the EditorType
export enum TemplateTypes {
  EMAIL = 'html',
  SCRIPT = 'javascript',
  HTML = 'html',
  SQL = 'sql',
  MQ = 'json',
  CSS = 'css'
}

// Used as api-path when fetching templates
export enum TemplateApiTypes {
  EMAIL = 'email',
  SCRIPT = 'script',
  HTML = 'html',
  SQL = 'sql',
  MQ = 'mq',
  CSS = 'css'
}

export interface TemplateMetaData {
  name: string,
  channel: string,
  url: string,
  locale: string,
  body?: string
}

export interface TemplateDataValiation {
  name: boolean,
  channel?: boolean,
  url: boolean,
  locale?: boolean
}
