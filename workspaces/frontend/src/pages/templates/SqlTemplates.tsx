import type { FC } from 'react';
import { useEffect } from 'react';
import type { RouteComponentProps } from 'react-router';
import { handleLegBoRoute } from 'utils/helpers';
import { TemplateTypes, TemplateApiTypes } from 'types/service/templates';
import type { SetShowLegacy } from 'types/global-types';
import type { Pages } from 'types/route-types';
import GenericTemplate from 'components/templates/GenericTemplate';

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy,
  viewId: Pages
}

const SqlTemplates:FC<Props> = ({ setShowLegacy, viewId }) => {
  const content: JSX.Element = (
    <GenericTemplate
      templateType={TemplateTypes.SQL}
      templateApiType={TemplateApiTypes.SQL}
    />
  );

  // location options are automatically passed in to props via <Route />
  // Conditionally render own content / update legacybackoffice path
  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowLegacy, viewId]);

  return content;
};

export default SqlTemplates;
