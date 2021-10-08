import type { FC } from 'react';
import styled from 'styled-components/macro';
import { Button, Header, Icon } from 'semantic-ui-react';
import type { TemplateApiTypes } from 'types/service/templates';
import { palette } from 'vars';

const NoTemplatesContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '10vh auto 0 auto',
});

interface NoTemplatesProps {
  templateApiType: TemplateApiTypes,
  onNewTemplate: () => void
}

const NoTemplates: FC<NoTemplatesProps> = ({ templateApiType, onNewTemplate }): JSX.Element => (
  <NoTemplatesContainer>
    <Header as="h2">
      <Icon.Group size="large">
        <Icon name="file outline" />
        <Icon corner name="frown" />
      </Icon.Group>
      No <span style={{ color: palette.yellow }}>{templateApiType} templates</span> found
    </Header>

    <Button primary onClick={onNewTemplate} as="a">Add template</Button>
  </NoTemplatesContainer>
);

export default NoTemplates;
