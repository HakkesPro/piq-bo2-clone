import type { FC } from 'react';
import type { MenuItem, MenuItemHeader, MenuItemOrFolder } from 'types/menu-items-types';
import type { Pages } from 'types/route-types';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import VerticalSidebarSubSection from 'elements/VerticalSidebarSubSection';
import SidebarMenuFolder from './SidebarMenuFolder';
import SidebarMenuSubItem from './SidebarMenuSubItem';
import { routeWithQueryParams } from 'utils/helpers';
import { pixelAmount } from 'vars';
import { SidebarMenuSections } from 'types/menu-items-types';

interface Props {
  option: MenuItemHeader,
  updateSelectedSubMenu: (item: MenuItemHeader) => void
  updateSelectedPage: (item: MenuItemHeader) => void
  activeSubMenu: Pages
  activePage: Pages
}

const SidebarMenuItems:FC<Props> = (props) => {
  const {
    option,
    updateSelectedSubMenu,
    updateSelectedPage,
    activeSubMenu,
    activePage,
  } = props;

  const { dropdownData } = option;
  const sectionOne = dropdownData && dropdownData[SidebarMenuSections.SECTION_ONE];
  const sectionTwo = dropdownData
    && dropdownData[SidebarMenuSections.SECTION_TWO]
    && dropdownData[SidebarMenuSections.SECTION_TWO];

  return (
    <VerticalSidebarSubSection paddingLeft={pixelAmount.xxl} noBorderBottom>
      {
       sectionOne && sectionOne.items.map((item: MenuItemOrFolder) => (
         item.subItems ? (
         // This is a level 2 parent, i.e has children that can be toggled open. E.g Rules -> Routing
           <div key={item.id}>
             <SidebarMenuFolder
               isSubItem
               item={item}
               updateSelectedSubItem={updateSelectedSubMenu}
               selectedItem={activeSubMenu}
             />

             { activeSubMenu === item.id && (
             <VerticalSidebarSubSection noBorderBottom>
               { item.subItems.map((subItem: MenuItem) => (
                 <SidebarMenuSubItem
                   key={subItem.id}
                   activePage={activePage}
                   onSelect={updateSelectedPage}
                   subItem={subItem}
                 />
               ))}
             </VerticalSidebarSubSection>
             )}

           </div>
         ) : (
         // This is a level 2 link (no children). E.g Rules -> Payment methods
           <SidebarMenuItem key={item.id} item={item} isActive={activePage === item.id} />
         )
       ))
     }

      { sectionTwo
      && (
      <>
        <VerticalSidebarSubSection
          style={{
            width: `calc(100% - ${pixelAmount.xl4})`,
            margin: `${pixelAmount.md} 0px ${pixelAmount.md} ${pixelAmount.xl}`,
          }}
        />

        { sectionTwo.items.map((item: MenuItemOrFolder) => (
          // This is a level 2 link (no children). E.g Rules -> Vat
          <SidebarMenuItem key={item.id} item={item} isActive={activePage === item.id} />
        ))}
      </>
      )}

    </VerticalSidebarSubSection>
  );
};

export default SidebarMenuItems;

interface MenuItemProps {
  item: MenuItem
  isActive: boolean
  onClick?: (item: MenuItem) => void
}

const SidebarMenuItem: FC<MenuItemProps> = (props) => {
  const { item, isActive, onClick } = props;
  const style = { textAlign: 'left', paddingLeft: pixelAmount.xl };

  return (
    <Menu.Item
      as={Link}
      style={style}
      onClick={() => onClick && onClick(item)}
      className={isActive ? 'active' : ''}
      to={routeWithQueryParams(item.toPath)}
    >
      { item.label }
    </Menu.Item>
  );
};
