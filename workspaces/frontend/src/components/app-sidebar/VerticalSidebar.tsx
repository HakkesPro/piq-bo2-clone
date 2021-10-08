import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { contextActions } from 'redux/actions';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  Menu,
  Sidebar,
  Image,
  Grid,
} from 'semantic-ui-react';
import { Pages } from 'types/route-types';
import { FixedSizes } from 'types/global-types';
import type { MenuItemHeader, MenuItemOrFolder } from 'types/menu-items-types';
import { VerticalSpacer } from 'components/help-components/Spacers';
import SidebarMenuFolder from './SidebarMenuFolder';
import SidebarMenuItems from './SidebarMenuItems';
import SidebarMenuItemWithIcon from './SidebarMenuItemWithIcon';
import { getMenuItems } from 'utils/menu-items';
import { routeWithQueryParams } from 'utils/helpers';
import { palette } from 'vars';

const SidebarOptionsWrapper = styled.div({
  height: `calc(100vh - ${FixedSizes.headerHeight}px)`,
  overflowY: 'auto',
  overflowX: 'hidden',
});

const SidebarLogoWrapper = styled(Menu.Item)({
  height: `${FixedSizes.headerHeight}px !important`,
  borderBottom: `1px solid ${palette.darkGrey}`,
  display: 'flex !important',
  justifyContent: 'center !important',
});

const VerticalSidebar:FC = () => {
  const { activePage, showDesktopSidebar } = useAppSelector(({ contextReducer }) => contextReducer);
  const userRoles = useAppSelector(({ metadataReducer }) => metadataReducer.roles);

  const [activeMenu, setActiveMenuX] = useState(getActiveMenu(activePage));
  const [activeSubMenu, setActiveSubMenuX] = useState(getActiveSubMenu(activePage));
  const dispatch = useAppDispatch();

  const menuItems: MenuItemHeader[] = getMenuItems(userRoles);

  const setActiveMenu = (page: Pages) => {
    setActiveMenuX(page);
  };

  const setActiveSubMenu = (page: Pages) => {
    setActiveSubMenuX(page);
  };

  const verticalSideBarUseEffect = () => {
    const activeMenuItem = getActiveMenu(activePage);
    const activeSubMenuItem = getActiveSubMenu(activePage);
    setActiveMenu(activeMenuItem);
    setActiveSubMenu(activeSubMenuItem);
  };

  useEffect(verticalSideBarUseEffect, [activePage]);

  const handleMenuClick = (menuItem: MenuItemHeader) => {
    if (menuItem.id === activeMenu) {
      // already open - user clicked to close it again. Reset to Home
      setActiveMenu(Pages.HOME);
    } else if (menuItem.dropdownData) {
      // This is just a parent menu option - not a page itself
      setActiveMenu(menuItem.id);
    } else {
      setActivePage(menuItem);
    }
  };

  const handleSubMenuClick = (menuItem: MenuItemOrFolder) => {
    if (menuItem.id === activeSubMenu) {
      // already open - user clicked to close it again. Reset to Home
      setActiveSubMenu(Pages.HOME);
    } else if (menuItem.subItems) {
      // This is just a parent menu option - not a page itself
      setActiveSubMenu(menuItem.id);
    } else {
      setActivePage(menuItem);
    }
  };

  const setActivePage = (item: MenuItemHeader) => {
    dispatch(contextActions.setActivePage(item.id));
  };

  const displayMenuChildren = (item: MenuItemHeader): boolean => activePage === item.id || activeMenu === item.id;

  const piqLogo = (white: boolean = true) => `https://static.paymentiq.io/paymentiq${white ? '-white' : ''}.png`;

  const testEnvironmentUrls = [
    'test',
    '127.0.0.1',
    'localhost',
    '0.0.0.0',
  ];
  const isTestEnv:boolean = testEnvironmentUrls.some((env) => window.location.origin.includes(env));
  // Have a different BG color for test and prod environment
  const getSideBarBg = () => (isTestEnv
    ? palette.dark
    : palette.darkGreen);

  const logoEl = () => <Image as={Link} to={routeWithQueryParams('/')} size="small" src={piqLogo(true)} />;

  return (
    <Sidebar
      as={Menu}
      animation="uncover"
      direction="left"
      icon="labeled"
      inverted
      vertical
      visible={showDesktopSidebar}
      width="thin"
      style={{ backgroundColor: getSideBarBg() }}
      className="desktop-sidebar"
    >
      <SidebarLogoWrapper className="test-sign" color="teal" header>
        {isTestEnv
          ? (
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column width={10}>
                  { logoEl() }
                </Grid.Column>
                <Grid.Column className="border-radius" floated="right" width={6}>
                  <p
                    data-testid="test-env"
                    className="border-radius"
                    style={{
                      padding: '0px 10px',
                      border: '1px solid orange',
                    }}
                  >
                    Test
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )
          : logoEl()}
      </SidebarLogoWrapper>
      <SidebarOptionsWrapper>
        { userRoles.length > 0 && (
          menuItems.map((item) => {
            if (item.dropdownData) {
              // Render menu options with sub-links (Tools, Analytics Rules, Admin)
              return (
                <div key={item.id}>
                  <SidebarMenuFolder
                    item={item}
                    handleMenuClick={handleMenuClick}
                    selectedMenu={activeMenu}
                  />

                  { displayMenuChildren(item)
                      && (
                      <SidebarMenuItems
                        updateSelectedSubMenu={handleSubMenuClick}
                        updateSelectedPage={setActivePage}
                        activeSubMenu={activeSubMenu}
                        activePage={activePage}
                        option={item}
                      />
                      )}

                </div>
              );
            }
            // Render menu options without any children, i.e just links like Transactions, Approve etc
            return (
              <Menu.Item
                className={(activePage === item.id) ? 'active' : ''}
                onClick={() => handleMenuClick(item)}
                key={item.id}
                style={{ textAlign: 'left' }}
                as={Link}
                to={routeWithQueryParams(item.toPath)}
              >
                <SidebarMenuItemWithIcon icon={item.icon} label={item.label} />
              </Menu.Item>
            );
          })
        )}
        <VerticalSpacer factor={4} />
      </SidebarOptionsWrapper>
    </Sidebar>
  );
};

export default VerticalSidebar;

const getActiveMenu = (activePage: Pages): Pages => {
  const menus = {
    TOOLS: Pages.TOOLS,
    FINANCE: Pages.FINANCE,
    ANALYTICS: Pages.ANALYTICS,
    RULES: Pages.RULES,
    FRAUD_BLOCKS: Pages.FRAUD_BLOCKS,
    ADMIN: Pages.ADMIN,
  };

  // If we're on the subpage ADMIN_TEMPLATES_HTML
  // we get the first folder by getting the
  // active page's prefix, in this case ADMIN from ADMIN_TEMPLATES_HTML
  const prefix: string = activePage.split('_')[0];
  if (menus[prefix as keyof typeof menus]) {
    return menus[prefix as keyof typeof menus];
  }
  return Pages.HOME; // return the root page just to not select anything
};

const getActiveSubMenu = (activePage: Pages): Pages => {
  const subMenus = {
    KYC: Pages.KYC,
    STORE: Pages.STORE,
    ROUTING: Pages.ROUTING,
    FEES: Pages.FEES,
    LIMIT: Pages.LIMIT,
    TEMPLATES: Pages.TEMPLATES,
  };

  // If we're on the subpage ADMIN_TEMPLATES_HTML
  // we can usually get the second folder by getting the
  // active page's second prefix, in this case TEMPLATES from ADMIN_TEMPLATES_HTML
  const prefix: string = activePage.split('_')[1];
  if (subMenus[prefix as keyof typeof subMenus]) {
    return subMenus[prefix as keyof typeof subMenus];
  }
  return Pages.HOME; // return the root page just to not select anything
};
