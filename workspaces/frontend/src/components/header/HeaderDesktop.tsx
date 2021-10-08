import {
  Menu,
  Item,
  Header,
  Icon,
  Grid,
} from 'semantic-ui-react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { palette, pixelAmount } from 'vars';
import { FixedSizes } from 'types/global-types';
import { HorisontalSpacer } from 'components/help-components/Spacers';
import LogoutDropdown from 'components/UserMenu';
import MerchantDropdown from 'components/MerchantDropdown';
import QuickNavigation from 'components/quick-navigation/QuickNavigation';
import useKeyboardShortcut from 'utils/hooks/use-keyboard-shortcut';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { contextActions } from 'redux/actions';
import { getPrettyPageTitle, getOsModifierKey } from 'utils/helpers';

const closeSidebarPaths = [
  '/analytics',
];
let isSideBarToggled = false;

const HeaderDesktop = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    activePage,
    showDesktopSidebar,
  } = useAppSelector(({ contextReducer }) => contextReducer);
  const [showQuickNavigation, setShowQuickNavigation] = useState(false);

  const history = useHistory();

  // We want to collapse the sidebar once visiting one of the paths in closeSidebarPaths, check 'isSideBarToggled'
  // (not reactive, hence outside the function).
  if (closeSidebarPaths.includes(history.location.pathname) && !isSideBarToggled) {
    dispatch(contextActions.setShowDesktopSidebar(false));
  }

  const handleSidebarToggle = () => {
    isSideBarToggled = true;
    dispatch(contextActions.setShowDesktopSidebar(!showDesktopSidebar));
    setTimeout(() => {
      isSideBarToggled = false;
    }, 300);
  };

  const handleQuickNavigationToggle = () => {
    setShowQuickNavigation(!showQuickNavigation);
  };

  // Register keyboard shortcut to show quick navigation
  useKeyboardShortcut(['Meta', 'K'], () => { handleQuickNavigationToggle(); }, { overrideSystem: true });

  return (
    <Menu borderless fixed="top" inverted={false} style={{ backgroundColor: palette.white }}>

      <Menu.Item onClick={handleSidebarToggle} className="sidebar-collapser" name="align justify">
        <Icon name="align justify" size="big" />
      </Menu.Item>

      <Menu.Item>
        { showQuickNavigation ? (
          <QuickNavigation toggleShowHandler={handleQuickNavigationToggle} />
        ) : (
          <>
            <Header
              onClick={handleQuickNavigationToggle}
              className="breadcrumbs"
              style={{ textTransform: 'capitalize', margin: '0px' }}
              as="h4"
            >
              {getPrettyPageTitle(activePage)}
            </Header>
            <Icon
              style={{ marginLeft: pixelAmount.lg, cursor: 'pointer' }}
              name="search"
              size="large"
              onClick={handleQuickNavigationToggle}
            />
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <div
                    style={{ marginRight: '-55px' }}
                    className="keyboard-btn-visual"
                  >
                    { getOsModifierKey() }
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div
                    style={{ marginRight: '-10px' }}
                    className="keyboard-btn-visual"
                  >
                    K
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        )}
      </Menu.Item>

      <Menu.Menu
        position="right"
        style={{ marginRight: showDesktopSidebar ? `${FixedSizes.sidebarWidth}px` : '' }}
      >
        <Item>
          <MerchantDropdown />
          <HorisontalSpacer factor={2} />
          <LogoutDropdown />
        </Item>
      </Menu.Menu>
    </Menu>
  );
};

export default HeaderDesktop;
