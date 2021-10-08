import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import type { RouteComponentProps } from 'react-router';
import {
  handleLegBoRoute,
  generateTableColumnsData,
  objectKeysToLowerCase,
} from 'utils/helpers';
import type {
  SetShowLegacy,
  GenerateTableColumnsDataItem,
  GenerateTableColumnsData,
} from 'types/global-types';
import { columnId } from '@paymentiq-backoffice-2/shared';
import type { Pages } from 'types/route-types';
import TableView from 'components/TableView';
import { fetchMerchantSummary, fetchMerchantPaymentMethods } from 'service/general-apis/general-service';
import { fetchMerchantTranslations } from 'service/front-api/front-api';
import type { MerchantSummary, MerchantPaymentMethods } from 'types/service/general-service-types';
import ViewLoader from 'components/ViewLoader';
import { v4 as uuidv4 } from 'uuid';

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy;
  viewId: Pages;
}

const PspIcons: FC<Props> = ({ setShowLegacy, viewId }) => {
  const { merchantId } = useAppSelector(({ contextReducer }) => contextReducer);

  const [isFetchingData, setIsFetchingData] = useState(false as boolean);
  const [paymentMethodsArr, setPaymentMethodsArr] = useState([] as Array<string>);
  const [translations, setTranslations] = useState({} as Record<string, string>);

  const getPaymentMethods = async () => {
    setIsFetchingData(true);
    const res: MerchantSummary = await fetchMerchantSummary(merchantId);
    const translationsRes = await fetchMerchantTranslations(merchantId);
    setTranslations(objectKeysToLowerCase(translationsRes));
    const dbIds = res.result && res.result.map((ruleSection) => ruleSection.dbId);
    if (dbIds) {
      const activePsps: string[] = [];
      const pmPromises: Array<Promise<any>> = dbIds.map(async (dbId) => {
        const { result }: MerchantPaymentMethods = await fetchMerchantPaymentMethods(merchantId, dbId);
        if (result && result.rules) {
          const flattenRulesValues = result.rules.map((val) => val.actions).flat().map((val) => val && val.value);
          const pmsAsString = flattenRulesValues
            .filter((val) => val !== 'Yes' && val !== 'No' && typeof val === 'string')
            .join('|')
            .split('|');
          pmsAsString.forEach((pm) => !activePsps.includes(pm) && activePsps.push(pm));
        }
        return result;
      });

      await Promise.all(pmPromises);
      const activePspsFiltered = activePsps.filter((pm) => pm);
      setPaymentMethodsArr(activePspsFiltered);
      setIsFetchingData(false);
    }
    // Add error handling UI (a new component is needed here or to be triggered with useState)
  };

  if (paymentMethodsArr.length === 0 && !isFetchingData) {
    getPaymentMethods();
  }

  const pspIconsTableData: false|GenerateTableColumnsDataItem[][] = paymentMethodsArr.length > 0
    && paymentMethodsArr.map((pm: string) => {
    // Provider name and service is combined with provider-service.
      // 'service' has precedence in getting logos in cashier so we will do the same here.
      const baseLogoEndpoint = 'https://static.paymentiq.io/';
      const splitByDash = pm.split('-');
      const logoTranslationKey = translations[`${splitByDash[splitByDash.length - 1].toLowerCase()}_logo`];
      const logoUrl = logoTranslationKey
        ? `${baseLogoEndpoint}${logoTranslationKey}.png`
        : `${baseLogoEndpoint}${splitByDash[0].toLowerCase()}.png`;
      const mid = logoTranslationKey ? merchantId.toString() : '0';

      return [
        {
          title: 'Merchant ID',
          data: mid,
        },
        {
          title: 'PSP (Provider)',
          data: pm,
        },
        {
          title: 'Logo',
          data: logoUrl,
        },
        {
          title: 'Created',
          data: '-',
        },
        {
          title: 'Updated',
          data: '-',
        },
        {
          title: columnId,
          data: uuidv4(),
          hide: true,
        },
      ];
    });

  const content = useMemo(() => {
    const getColumns: (
      startIndex: number,
      endIndex: undefined|number,
      searchInputValue?: string,
    ) => Promise<GenerateTableColumnsData> = async (
      startIndex,
      endIndex,
      searchInputValue,
    ) => generateTableColumnsData(pspIconsTableData, startIndex, endIndex, searchInputValue);

    return pspIconsTableData ? (
      <TableView
        title="PSP Icons"
        getColumns={getColumns}
        // eslint-disable-next-line no-console
        handleClick={(p) => console.log(p)} // will do something more exciting with this, open up a modal cmpnt or smhtn.
      />
    )
      : (
        <ViewLoader
          additionalText="Getting data ..."
        />
      );
  }, [pspIconsTableData]);

  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !content);
  }, [content, setShowLegacy, viewId]);

  return content;
};

export default PspIcons;
