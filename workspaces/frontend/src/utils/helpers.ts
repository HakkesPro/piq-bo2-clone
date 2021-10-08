import { AuthApi } from 'service';
import { EnvironmentTypes } from 'types/app-config-types';
import type {
  AuthStatus,
  SetShowLegacy,
  ColumnItem,
  GenerateTableColumnsDataItem,
  GenerateTableColumnsData,
} from 'types/global-types';
import { hideColumnSuffix, columnId } from '@paymentiq-backoffice-2/shared';
import type { GeneralMetaData, PaymentIqRoles } from 'types/service/metadata';
import type { PaymentIQGeneralSettings } from 'types/local-storage-types';
import { getLocalStorage } from 'utils/local-storage';
import { LocalStorageKeys } from 'types/local-storage-types';
import type { MenuItem, MenuItemSubItemSections } from 'types/menu-items-types';
import { setNewBoPath } from 'utils/post-message/api';
import { LegacyRoutePaths, RoutePaths } from 'types/route-types';
import type { Pages } from 'types/route-types';
import appConfig from '../app-config';
import { searchResultColumns } from './search-helpers';
import { cloneDeep } from 'lodash';

export const checkIsAuthenticated = async (): Promise<AuthStatus> => {
  const authResponse = await AuthApi.authCheck();
  const resData = {
    statusCode: authResponse.status,
  };
  if (authResponse.status === 401) {
    const authenticateHeader: string | null = authResponse.headers.get('www-authenticate');
    if (authenticateHeader) {
      const oAuthPath = authenticateHeader
        .split('authorization_uri="')[1]
        .replace(/['"]+/g, ''); // split to get the path, and strip away trailing comma
      return {
        ...resData,
        isAuthenticated: false,
        authPath: oAuthPath,
      };
    }
  } else if (authResponse.status === 200) {
    const metadata: GeneralMetaData = await authResponse.json();
    return {
      ...resData,
      isAuthenticated: true,
      metadata,
    };
  } else {
    return {
      ...resData,
      isAuthenticated: false,
      statusCode: authResponse.status,
    };
  }

  // if all else fails -> return false
  return {
    isAuthenticated: false,
  };
};

export const getSelectedMerchantId = (): number | false => {
  // First load the localStorage value will be undefined
  const piqSettings: PaymentIQGeneralSettings | false = getLocalStorage(
    LocalStorageKeys.PAYMENTIQ_GENERAL_SETTINGS,
  );
  if (piqSettings && piqSettings.merchantId) {
    return piqSettings.merchantId;
  }
  return false;
};

export const getLegacyBaseUrl = (): string => {
  const env: string | undefined = process.env.REACT_APP_ENVIRONMENT;
  const url = (uri: string) => `${uri}`;
  switch (env) {
    case EnvironmentTypes.PRODUCTION:
      return url(appConfig[EnvironmentTypes.PRODUCTION].legacyBackofficeUrl);
    case EnvironmentTypes.TEST:
      return url(appConfig[EnvironmentTypes.TEST].legacyBackofficeUrl);
    case EnvironmentTypes.DEV:
      return url(appConfig[EnvironmentTypes.DEV].legacyBackofficeUrl);
    case EnvironmentTypes.DEV_HOSTED:
      return url(appConfig[EnvironmentTypes.DEV_HOSTED].legacyBackofficeUrl);
    default:
      return url(appConfig[EnvironmentTypes.PRODUCTION].legacyBackofficeUrl);
  }
};

export const verifyRoles = (
  validRoles: PaymentIqRoles[] | null,
  invalidRoles: PaymentIqRoles[] | null | undefined,
  userRoles: PaymentIqRoles[],
) => {
  type CallbackType = (role: PaymentIqRoles) => boolean;
  const checkRoles = (itemRoles: PaymentIqRoles[], callback: CallbackType) =>
    itemRoles.some(callback);
  let isValid = true;
  if (validRoles) {
    // Check if user has any of the these validRoles
    const hasValidRole = checkRoles(validRoles, (role) =>
      userRoles && userRoles.includes(role));
    if (!hasValidRole) isValid = false;
  } else if (invalidRoles) {
    // Check if user DOES NOT have any of these invalidRoles
    const hasInvalidRole = checkRoles(
      invalidRoles,
      (role) => !userRoles.includes(role),
    );
    if (!hasInvalidRole) isValid = false;
  }
  return isValid;
};

export const hasValidRoles = (
  item: MenuItem|MenuItemSubItemSections,
  userRoles: Array<PaymentIqRoles>,
): boolean => {
  const isAllowed = Object.keys(item).includes('isAllowed')
    ? item.isAllowed
    : true;
  return verifyRoles(item.validRoles, item.invalidRoles, userRoles) && isAllowed as boolean;
};

export const updateLegBoPath = (path: string) => {
  // Update path via callback prop if we render legacy-bo
  setNewBoPath(path);
};

// Handle leg bo path and hide/show
export const handleLegBoRoute = (
  setShowLegacy: SetShowLegacy,
  viewId: Pages,
  show: boolean,
) => {
  // eslint-disable-next-line no-unused-expressions
  const legBoRoutesKeys: Array<string> = Object.keys(LegacyRoutePaths);
  if (legBoRoutesKeys.includes(viewId)) {
    const path = legBoRoutesKeys.find((route) => route === viewId) as keyof typeof LegacyRoutePaths;
    updateLegBoPath(LegacyRoutePaths[path]);
  }
  setShowLegacy(show);
};

interface RouteObject {
  pathname: string;
  search: string;
}
export const routeWithQueryParams = (route?: string): RouteObject | null =>
  (route ? { pathname: route, search: window.location.search } : null);

/**
 * @param enumValue - a url path. E.g /templates/email
 * Returns the enum key (as string) matching the enumValue. E.g ADMIN_TEMPLATES_EMAIL
 */
export const getRoutePathKeyByValue = (enumValue: string): string => {
  const keys = Object.keys(RoutePaths).filter(
    (enumProp) => RoutePaths[enumProp as keyof typeof RoutePaths] === enumValue,
  );
  return keys.length > 0 ? keys[0] : '';
};

export const getPrettyPageTitle = (path: Pages): string => path && path.replaceAll('_', ' / ').toLocaleLowerCase();

export const getOsModifierKey = (): string => {
  let OSName = 'Unknown OS';
  let keyName = 'Ctrl';
  if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
  if (OSName === 'MacOS') {
    keyName = 'Cmd';
  }
  return keyName;
};

export const generateTableColumnsData = (
  tableDataPar: GenerateTableColumnsDataItem[][]|undefined|null|false,
  sliceStart?: number,
  sliceEnd?: undefined|number, // When undefined .. no is made if sliceStart has 0 index.
  searchInput?: undefined|string,
): GenerateTableColumnsData => {
  const tableData = tableDataPar || []; // Adding default here instead since it could be null|false and not just undefined
  let columnsData: Array<ColumnItem> = [];
  // eslint-disable-next-line no-unused-expressions
  tableData[0] && tableData[0].forEach((val: GenerateTableColumnsDataItem) => {
    columnsData.push({
      title: val.title,
      data: [],
    });
  });

  const dataFlattened = tableData.flat();
  dataFlattened.forEach((val: GenerateTableColumnsDataItem) => {
    columnsData.forEach((column) => {
      if (column.title === val.title) {
        column.data.push(val.data);
      }
    });
  });

  let splittedColumns = columnsData;

  let searchResult = null;
  let searchTotal = null;
  if (searchInput) {
    const { result, total, data } = searchResultColumns(columnsData, searchInput);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchResult = result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchTotal = total;
    columnsData = data;
  }

  // Slice the data
  if (sliceStart || sliceEnd) {
    splittedColumns = columnsData.map((val) => ({
      title: val.title,
      data: val.data.slice(sliceStart, sliceEnd),
    }));
  }

  const columns = splittedColumns.length > 0 ? splittedColumns : [{
    title: 'null',
    data: ['null', 'null', 'null'],
  }];

  const hiddenColumns = tableData[0].filter((v) => v.hide).map((v) => v.title);
  if (hiddenColumns.length > 0) {
    columns.forEach((column) => {
      if (hiddenColumns.includes(column.title)) {
        column.title = `${column.title}${hideColumnSuffix}`;
      }
    });
  }

  return {
    ...searchResult && { result: searchResult },
    data: columns,
    total: columnsData[0] ? columnsData[0].data.length : 0,
  };
};

export const objectKeysToLowerCase = (obj: Record<string, any>) => {
  const objectAsArray = Object.entries(obj);
  const lowerCasedObject: Record<string, string> = {};
  objectAsArray.forEach((arr: [string, any]) => {
    const [key, value] = arr;
    lowerCasedObject[key.toLowerCase()] = value;
  });
  return lowerCasedObject;
};

type MergeTableData = (
  updatedData: ColumnItem[],
  orignalData: null|ColumnItem[],
  customCallback?: (mergedData: ColumnItem[]) => void
) => null|ColumnItem[]
export const mergeTableData: MergeTableData = (updatedData, orignalData, customCallback) => {
  const allNewColumns: null|ColumnItem[] = cloneDeep(orignalData);
  const allColumsIds = orignalData?.find((val) => val.title === 'ID' || val.title === `${columnId}${hideColumnSuffix}`);
  const dataIds = updatedData.find((val) => val.title === 'ID');
  // eslint-disable-next-line no-unused-expressions
  allColumsIds && allColumsIds.data.forEach((id, i) => {
    // eslint-disable-next-line no-unused-expressions
    dataIds && dataIds.data.find((dataId, dataIndex) => {
      if (id === dataId) {
        if (allNewColumns) {
          allNewColumns.forEach((allNewColumn, allNewColumnIndex) => {
            allNewColumns[allNewColumnIndex].data[i] = updatedData[allNewColumnIndex].data[dataIndex];
          });
        }
      }
      return id === dataId;
    });
  });
  // eslint-disable-next-line no-underscore-dangle
  if (customCallback) customCallback(allNewColumns!);
  return allNewColumns;
};
