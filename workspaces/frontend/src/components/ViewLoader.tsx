import type { FC } from 'react';
import styled from 'styled-components/macro';
import { Grid, Placeholder } from 'semantic-ui-react';
import { pixelAmount } from 'vars';

const Wrapper = styled.div({
  width: `calc(100% - ${pixelAmount.xxl})`,
  margin: `${pixelAmount.lg} 0px`,
  position: 'relative',
  zIndex: -1,
});

interface ViewLoaderProps {
  loaderType?: 'table' | 'config' | 'table',
  additionalText?: string
}

const ViewLoader: FC<ViewLoaderProps> = ({ loaderType, additionalText }) => {
  const ViewLoaderType = () => {
    switch (loaderType) {
      case 'table':
        return <TableLoader />;
      default:
        return <TableLoader />;
    }
  };

  const TableLoader = () => {
    const rowsCount = 20;
    const columnsCount = 16;
    const columnsCountKeys:number[] = [];

    for (let i = 0; i < columnsCount; i += 1) {
      columnsCountKeys.push(i);
    }

    return (
      <Grid rows={2} columns={columnsCount} stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
            </Placeholder>
          </Grid.Column>
        </Grid.Row>
        {Array(columnsCount)
          .fill(0)
          .map((row, i) => (
            <Grid.Column key={columnsCountKeys[i]} width={1}>
              <Placeholder>
                {Array(rowsCount)
                  .fill(0)
                  .map(() => (
                    <Placeholder.Line key={Math.random()} length="full" />
                  ))}
              </Placeholder>
            </Grid.Column>
          ))}
      </Grid>
    );
  };

  return (
    <Wrapper>
      <ViewLoaderType />
      { additionalText && (
        <h3
          style={{
            textAlign: 'center',
            color: '#777777',
          }}
        >
            {additionalText}
        </h3>
      ) }
    </Wrapper>
  );
};

export default ViewLoader;
