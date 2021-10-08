import {
  GET, POST, DELETE, PUT,
} from '../REST';
import type {
  FetchTemplatesParameters,
  FetchTemplateHistoryParameters,
  CreateTemplateParameters,
  UpdateTemplateParameters,
  DeleteTemplateParameters,
  TemplateResponse,
  TemplateHistoryResponse,
  CreateUpdateTemplateResponse,
} from 'types/service/templates';

export const fetchTemplates = async (parameters: FetchTemplatesParameters): Promise<TemplateResponse> => {
  const { type, merchantId } = parameters;
  const response = await GET(
    `/paymentiq/backoffice/api/template/${type}/read?merchantId=${merchantId}&start=0&limit=50`,
  );

  return response.json();
};

export const fetchTemplateHistory = async (
  parameters: FetchTemplateHistoryParameters,
): Promise<TemplateHistoryResponse> => {
  const { templateType, merchantId, limit = '30' } = parameters;
  const response = await GET(
    `/paymentiq/backoffice/api/template/html/history/${templateType}?limit=${limit}&merchantId=${merchantId}`,
  );

  return response.json();
};

export const createTemplate = async (
  parameters: CreateTemplateParameters,
): Promise<CreateUpdateTemplateResponse> => {
  const { merchantId, payload } = parameters;
  const response = await POST(`/paymentiq/backoffice/api/template/?merchantId=${merchantId}`, payload);

  return response.json();
};

export const updateTemplate = async (
  parameters: UpdateTemplateParameters,
): Promise<CreateUpdateTemplateResponse> => {
  const { merchantId, payload } = parameters;
  const response = await PUT(
    `/paymentiq/backoffice/api/template/${payload.id}/?merchantId=${merchantId}`,
    payload,
  );

  return response.json();
};

export const deleteTemplate = async (parameters: DeleteTemplateParameters): Promise<TemplateResponse> => {
  const { merchantId, templateId } = parameters;
  const response = await DELETE(`/paymentiq/backoffice/api/template/${templateId}?merchantId=${merchantId}`);

  return response.json();
};
