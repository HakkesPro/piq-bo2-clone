import type { FC } from 'react';
import styled from 'styled-components/macro';
import type { MenuItemHeader } from 'types/menu-items-types';
import { Grid, Icon } from 'semantic-ui-react';
import { pixelAmount, fontSize } from 'vars';

const MenuGridRow = styled(Grid.Row)({
  padding: '1.2rem 0 !important',
});

const SidebarMenuItemWithIcon: FC<Required<Pick<MenuItemHeader, 'label' | 'icon'>>> = ({ icon, label }) => (
  <Grid>
    <MenuGridRow>
      <Grid.Column>
        <Icon name={icon} size="small" />
      </Grid.Column>
      <Grid.Column stretched width={10}>
        <span style={{
          marginLeft: pixelAmount.sm,
          fontSize: fontSize.textLg,
        }}
        >
          { label }
        </span>
      </Grid.Column>
    </MenuGridRow>
  </Grid>
);

export default SidebarMenuItemWithIcon;
