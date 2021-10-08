import { Suspense, useEffect } from 'react';
import type { FC } from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import type { AppDispatch } from 'redux/store';
import type { RoutePaths } from 'types/route-types';
import { Pages } from 'types/route-types';
import { useLocation } from 'react-router-dom';
import { metadataActions, contextActions } from 'redux/actions';
import { parseMerchants } from 'utils/merchant-dropdown-utils';
import type {
  PaymentIqRoles,
  GeneralMetaData,
  GeneralMetaDataMerchant,
  MerchantMetaData,
} from 'types/service/metadata';
import { MetadataApi } from 'service';
import ViewLoader from 'components/ViewLoader';
import Header from 'components/header/Header';
import AppRoutes from './routing/AppRoutes';
import { getPrettyPageTitle, getRoutePathKeyByValue } from 'utils/helpers';
import type { MerchantId, SetShowLegacy } from 'types/global-types';
import { FixedSizes } from 'types/global-types';
import { pixelAmount } from 'vars';
import 'utils/style/App.scss';

const ApplicationWrapper = styled.div({
  height: `calc(100vh - ${FixedSizes.headerHeight}px)`,
  marginTop: `${FixedSizes.headerHeight}px`,
  padding: pixelAmount.lg,
});

const SmallLegWrapper = styled.div({
  position: 'absolute',
  top: 0,
  zIndex: 10000,
});

interface AppProps {
  metadata: GeneralMetaData;
  style?: { marginRight: string, overflow: string };
  setShowLegacy: SetShowLegacy;
  legacyMobile?: FC<{ showLegacy: boolean }>;
}

const App: FC<AppProps> = ({
  style,
  legacyMobile: LegacyMobile,
  setShowLegacy,
  metadata,
}) => {
  const { merchantId } = useAppSelector(({ contextReducer }) => contextReducer);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    /* Set the current users access roles and available merchants */
    setGeneralMetadata(dispatch, metadata);
    getMerchantMetadata(dispatch, merchantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setActivePageId(dispatch, location.pathname);
  }, [location, dispatch]);

  return (
    <ApplicationWrapper style={style && style}>
      <Header />

      {LegacyMobile && (
        <SmallLegWrapper>
          <LegacyMobile showLegacy />
        </SmallLegWrapper>
      )}

      <Suspense fallback={<ViewLoader />}>
        <AppRoutes setShowLegacy={setShowLegacy} />
      </Suspense>
    </ApplicationWrapper>
  );
};

const setGeneralMetadata = (dispatch: AppDispatch, metadata: GeneralMetaData) => {
  const merchants: GeneralMetaDataMerchant = metadata.allMerchants[1];
  const roles: PaymentIqRoles[] = metadata.user[1].authorities.map(
    (obj: { authority: PaymentIqRoles }) => obj.authority,
  );
  const userName = metadata.user[1].fullName || metadata.user[1].name;

  dispatch(metadataActions.setMerchants(parseMerchants(merchants)));
  dispatch(metadataActions.setRoles(roles));
  dispatch(contextActions.setUserName(userName || ''));
};

const getMerchantMetadata = async (dispatch: AppDispatch, merchantId: MerchantId) => {
  const response: MerchantMetaData = await MetadataApi.fetchMerchantMetadata(merchantId);
  const { oidc } = response;
  const { accountUrl } = oidc[merchantId];
  dispatch(contextActions.setAccountUrl(accountUrl));
};

const setActivePageId = (dispatch: AppDispatch, pathname: string) => {
  const routePathKey = getRoutePathKeyByValue(pathname);
  const page = Pages[routePathKey as keyof typeof RoutePaths];

  // Change it so that Page title follows this format: {Route} - PaymentIQ Backoffice
  const prettyTitle = getPrettyPageTitle(page) || '';
  const pageTitle = prettyTitle.charAt(0).toLocaleUpperCase() + prettyTitle.slice(1);

  document.title = `${pageTitle} - PaymentIQ Backoffice`;
  dispatch(contextActions.setActivePage(page));
};

export default App;
