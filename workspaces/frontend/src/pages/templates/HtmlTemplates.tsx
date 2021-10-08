import type { FC } from 'react';
import { useEffect } from 'react';
import type { RouteComponentProps } from 'react-router';
import { TemplateTypes, TemplateApiTypes } from 'types/service/templates';
import { handleLegBoRoute } from 'utils/helpers';
import type { SetShowLegacy } from 'types/global-types';
import type { Pages } from 'types/route-types';
import GenericTemplate from 'components/templates/GenericTemplate';

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy,
  viewId: Pages
}

const HtmlTemplates:FC<Props> = ({ setShowLegacy, viewId }) => {
  const content: JSX.Element = (
    <GenericTemplate
      templateType={TemplateTypes.HTML}
      templateApiType={TemplateApiTypes.HTML}
    />
  );

  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowLegacy, viewId]);

  return content;
};

export default HtmlTemplates;
