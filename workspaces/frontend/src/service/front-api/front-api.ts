import { GET } from '../REST';
import appConfig from 'app-config';
import { EnvironmentTypes } from 'types/app-config-types';
// import type {} from 'types/service/general-service-types';

const env = EnvironmentTypes[process.env.REACT_APP_ENVIRONMENT as EnvironmentTypes];

export const fetchMerchantTranslations = async (merchantId: number): Promise<Record<string, string>> => {
  const response = await GET(
    null,
    `${appConfig[env].piqApiEndpoint}/resource/translations?locale=en&merchantId=${merchantId}`,
  );
  return response.json();
};
