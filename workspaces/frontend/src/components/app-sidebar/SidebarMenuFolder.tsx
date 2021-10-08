import type { FC } from 'react';
import type { MenuItemHeader } from 'types/menu-items-types';
import { Menu, Grid, Icon } from 'semantic-ui-react';
import OptionWithIcon from './SidebarMenuItemWithIcon';
import { pixelAmount } from 'vars';

interface Props {
  item: MenuItemHeader,
  handleMenuClick?: (item: MenuItemHeader) => void,
  selectedMenu?: string,
  isSubItem?: boolean,
  updateSelectedSubItem?: (id: MenuItemHeader) => void,
  selectedItem?: string
}

const SidebarMenuFolder:FC<Props> = (props) => {
  const {
    item,
    handleMenuClick,
    selectedMenu,
    isSubItem = false,
    updateSelectedSubItem,
    selectedItem,
  } = props;

  const clickHandler = (menuItem: MenuItemHeader) => {
    if (!isSubItem) {
      if (handleMenuClick) handleMenuClick(menuItem);
    } else if (updateSelectedSubItem) {
      updateSelectedSubItem(menuItem);
    }
  };

  const isSelected = item.id === selectedMenu || item.id === selectedItem;
  return (
    <Menu.Item
      className={isSelected ? 'active' : ''}
      style={{
        textAlign: 'left',
        paddingRight: `${isSubItem ? pixelAmount.sm : pixelAmount.lg}`,
        width: '100%',
        height: '100%',
      }}
      as="a"
    >
      <Grid columns={2} divided onClick={() => clickHandler(item)}>
        <Grid.Row>
          <Grid.Column>
            { item.icon
              ? <OptionWithIcon icon={item.icon} label={item.label} />
              : <span>{ item.label }</span>}
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'right' }}>
            <Icon
              style={{ marginRight: isSubItem && pixelAmount.lg }}
              name={isSelected ? 'angle down' : 'angle right'}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Menu.Item>
  );
};

export default SidebarMenuFolder;
