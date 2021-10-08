import type { FC } from 'react';
import type { MenuItemHeader } from 'types/menu-items-types';
import type { Pages } from 'types/route-types';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { pixelAmount } from 'vars';
import { routeWithQueryParams } from 'utils/helpers';

interface Props {
  subItem: MenuItemHeader
  onSelect: (item: MenuItemHeader) => void
  lastItem?: boolean
  activePage: Pages
}

const SubItem:FC<Props> = (props): JSX.Element => {
  const { subItem, onSelect, activePage } = props;

  return (
    <Menu.Item
      onClick={() => onSelect(subItem)}
      className={activePage === subItem.id ? 'active' : ''}
      key={subItem.id}
      style={{
        textAlign: 'left',
        padding: `${pixelAmount.lg} ${pixelAmount.lg}`,
        marginLeft: pixelAmount.xxl,
      }}
      as={Link}
      to={routeWithQueryParams(subItem.toPath)}
    >
      { subItem.label }
    </Menu.Item>
  );
};

export default SubItem;
