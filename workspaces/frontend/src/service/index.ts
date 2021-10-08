import { authCheck, logout } from './auth/auth-service';
import {
  fetchGeneralMetadata,
  fetchMerchantMetadata,
} from './metadata/metadata-service';
import {
  fetchTemplates,
  fetchTemplateHistory,
  updateTemplate,
  deleteTemplate,
  createTemplate,
} from './templates/templates-service';

const AuthApi = {
  authCheck,
  logout,
};

const MetadataApi = {
  fetchGeneralMetadata,
  fetchMerchantMetadata,
};

const TemplateApi = {
  fetchTemplates,
  fetchTemplateHistory,
  updateTemplate,
  deleteTemplate,
  createTemplate,
};

export { AuthApi, MetadataApi, TemplateApi };
