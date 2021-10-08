import styled from 'styled-components/macro';

export const HorisontalSpacer = styled.div<{ factor: number }>(({ factor }) => ({
  width: factor * 8,
}));

export const VerticalSpacer = styled.div<{ factor: number }>(({ factor }) => ({
  height: `${8 * factor}px`,
}));
