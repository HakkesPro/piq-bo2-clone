import styled from 'styled-components/macro';

export const EditorWrapper = styled.div({
  display: 'flex',
  height: 'calc(100% - 120px)',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
});

interface EditorBackgroundProps {
  offsetHeight?: string;
}

export const EditorBackground = styled.section<EditorBackgroundProps>`
  flex-grow: 1,
  background-color: '#1e1e1e',
  position: 'absolute',
  top: 
  zIndex: -1,
  height: 'calc(100% - 56px)',
  width: '100%'
`;
