import styled from 'styled-components/macro';
import { palette, pixelAmount } from 'vars';

interface Props {
  noBorderBottom?: boolean;
  paddingLeft?: string;
}

const VerticalSidebarSubSection = styled.section<Props>`
  border-bottom: ${(props) => (props.noBorderBottom ? '0px' : '1px')} solid
    ${palette.lightGrey};
  margin: ${pixelAmount.md} 0px;
  padding-bottom: ${pixelAmount.md};
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : '0px')};
`;

export default VerticalSidebarSubSection;
