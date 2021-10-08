import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components/macro';
import { RoutePaths, LegacyRoutePaths } from 'types/route-types';
import LegacyBackofficeWrapper from 'elements/LegacyBackofficeWrapper';
import ViewLoader from 'components/ViewLoader';
import { getLegacyBaseUrl } from '../utils/helpers';
import { pixelAmount } from 'vars';

const Wrapper = styled.div({
  height: '100%',
});

const LegacyBackoffice: FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Iframe reports onLoad when the initial request has loaded (body.onload)
  // After that we still have to wait for legacy backoffice to actually load. 300ms is arbitrary, maybe tweak this
  const handleLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  function getRoutePathKeyByValue(enumValue: string): string {
    const keys = Object.keys(RoutePaths).filter(
      (enumProp) =>
        RoutePaths[enumProp as keyof typeof RoutePaths] === enumValue,
    );
    return keys.length > 0 ? keys[0] : '';
  }

  /*
    We need to get the initial Legacy Backoffice Url based on the current route in this app.
    We've mapped up all new and legeacy routes in enums (types/route-types) using the same keys.
    We leverage this by getting the correct enum key based on the current location.pathname.
    Then we use that key to get the corresponding legacy path
  */
  const getLegacyBackofficeUrl = () => {
    // Returnes the current enum KEY for the current path (HOME, TRANSACTIONS etc)
    // Read from window.location.pathname to not trigger a re-render based on new react-router pathname
    const routePathKey = getRoutePathKeyByValue(window.location.pathname);

    if (Object.keys(LegacyRoutePaths).includes(routePathKey)) {
      // Use that key to get the legacy backoffice url. E.g LegacyRoutePaths.TRANSACTIONS -> /#transaction/search/
      // This if check is to check that this path exist in LEG-BO.
      // Since we're coming up with new routes on this new BO they might not exist on old one.
      const legacyPath = LegacyRoutePaths[routePathKey as never];
      return `${getLegacyBaseUrl()}/${legacyPath}`;
    }
    return '/';
  };

  return (
    <LegacyBackofficeWrapper>
      <Wrapper>
        {isLoading && (
          <div style={{ padding: pixelAmount.lg }}>
            <ViewLoader />
          </div>
        )}
        <iframe
          onLoad={handleLoad}
          id="legacy-backoffice-wrapper"
          title="Backoffice iframed"
          src={getLegacyBackofficeUrl()}
          frameBorder="0"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Wrapper>
    </LegacyBackofficeWrapper>
  );
};

export default LegacyBackoffice;
