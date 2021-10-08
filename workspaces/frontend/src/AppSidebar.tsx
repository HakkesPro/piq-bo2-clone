import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAppSelector } from 'redux/hooks';
import { Segment, Sidebar } from 'semantic-ui-react';
import App from './App';
import VerticalSidebar from 'components/app-sidebar/VerticalSidebar';
import type { GeneralMetaData } from 'types/service/metadata';
import { BrowserRouter as Router } from 'react-router-dom';
import { FixedSizes } from 'types/global-types';
import LegacyBackoffice from 'components/LegacyBackoffice';
import { registerListeners } from 'utils/post-message/api';

interface AppProps {
  metadata: GeneralMetaData;
}

const AppSidebar: FC<AppProps> = ({ metadata }) => {
  const { showDesktopSidebar, merchantId } = useAppSelector(({ contextReducer }) => contextReducer);
  const [showLegacy, setShowLegacy] = useState(false);
  const [hasAddedSupportWidget, setHasAddedSupportWidget] = useState(false);

  useEffect(() => setupSupportWidget({
    merchantId,
    hasAddedSupportWidget,
    setHasAddedSupportWidget,
    userMetadata: metadata.user,
    companyName: metadata.allMerchants[1].companyName,
  }), [
    merchantId,
    hasAddedSupportWidget,
    metadata.user,
    metadata.allMerchants,
  ]);
  useEffect(registerListeners, []);

  return (
    <>
      <Router>
        <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>
          <VerticalSidebar />

          <Sidebar.Pusher>
            {window.innerWidth > 890 && (
              <div style={{ marginRight: showDesktopSidebar ? `${FixedSizes.sidebarWidth}px` : '' }}>
                <LegBoWrapper showLegacy={showLegacy} />
              </div>
            )}
            <App
              setShowLegacy={setShowLegacy}
              style={{
                marginRight: showDesktopSidebar ? `${FixedSizes.sidebarWidth}px` : '',
                overflow: 'scroll',
              }}
              metadata={metadata}
            />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <div id="piq-groove-el-bo2" />
      </Router>
    </>
  );
};

const LegBoWrapper: FC<{ showLegacy: boolean }> = ({ showLegacy }) => (
  <div className={showLegacy ? 'display-show' : 'display-hide'}>
    <LegacyBackoffice />
  </div>
);

declare global {
  interface Window {
    // eslint-disable-next-line camelcase
    _PaymentIQ_GROOVE_API_: any;
    GrooveWidget: any;
  }
}
interface SetupSupportWidgetArgs {
  merchantId: number,
  hasAddedSupportWidget: boolean,
  setHasAddedSupportWidget: (boo: boolean) => void,
  userMetadata: Record<string, any>
  companyName: string|null,
}
const setupSupportWidget = ({
  merchantId,
  hasAddedSupportWidget,
  setHasAddedSupportWidget,
  userMetadata,
  companyName,
}: SetupSupportWidgetArgs) => {
  // Only add this once
  if (!hasAddedSupportWidget) {
    setHasAddedSupportWidget(true);

    // eslint-disable-next-line no-underscore-dangle
    const GrooveWidget = new window._PaymentIQ_GROOVE_API_('#piq-groove-el-bo2',
      {
        // Mock status res. 200 returns success. Anything else is fail. # omit this for production
        // resStatusMock: 200,
        floatingBtn: true, // Display floating close button at bottom
        // Instead of closing the contactform with floatingBtn, send postmessage to top parent to close the iframe.
        sendPostMessageToClose: false,
        fromPage: `PaymentIQ Backoffice (${window.location.hostname})`, // Required
        supportEmail: 'technicalsupport@bambora.com',
        defaultCategory: 'Other question', // Needs to match an existing category.
        additionalTicketData: {
          userName: userMetadata[1].fullName || userMetadata[1].name || userMetadata[1].givenName,
          email: userMetadata[1].email,
          userMerchantId: merchantId,
          userMerchantName: companyName,
        },
        theme: {
          // Accepts two properties. background and color. Omit this to use default theme.
          // background: 'green',
          // color: '#ffffff'
        },
      });
    window.GrooveWidget = GrooveWidget;
  }
};

export default AppSidebar;
