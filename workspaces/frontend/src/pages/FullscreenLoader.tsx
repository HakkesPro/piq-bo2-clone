import React from 'react';
import styled from 'styled-components/macro';
import { Image } from 'semantic-ui-react';
import { palette } from '../vars/palette';

const Wrapper = styled.div({
  display: 'flex',
  height: '100vh',
  backgroundColor: palette.purple,
});

const LogoWrapper = styled.div({
  margin: '0 auto !important',
  height: '200px',
  alignSelf: 'center',
});

const FullScreenLoader: React.FC = () => (
  <Wrapper>
    <LogoWrapper>
      <Image
        size="medium"
        src="https://static.paymentiq.io/piq-logo-transparent.png"
      />
    </LogoWrapper>
  </Wrapper>
);

export default FullScreenLoader;
