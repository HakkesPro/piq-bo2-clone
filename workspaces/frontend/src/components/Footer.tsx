import type { FC } from 'react';
import styled from 'styled-components/macro';
import { Container, List, Segment } from 'semantic-ui-react';
import { FixedSizes } from 'types/global-types';
import { palette } from 'vars';
import { useAppSelector } from 'redux/hooks';

const FooterWrapper = styled.div({
  position: 'fixed',
  backgroundColor: palette.darkGreen,
  height: `${FixedSizes.footerHeight}px`,
  bottom: '0',
  width: '100%',
});

const Footer: FC = (): JSX.Element => {
  const { merchantId } = useAppSelector(({ contextReducer }) => contextReducer);

  return (
    <FooterWrapper>
      <Segment fixed="bottom" vertical style={{ padding: '0.3em 0em' }}>
        <Container textAlign="center">
          <List horizontal inverted divided link size="small">
            <List.Item>PaymentIQ</List.Item>
            <List.Item>Merchant ID: {merchantId}</List.Item>
            <List.Item as="a" href="#">
              Terms and Conditions
            </List.Item>
            <List.Item as="a" href="#">
              Support
            </List.Item>
          </List>
        </Container>
      </Segment>
    </FooterWrapper>
  );
};

export default Footer;
