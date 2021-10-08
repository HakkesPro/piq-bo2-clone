import type { FC } from 'react';
import { useMemo, useEffect } from 'react';
import type { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { handleLegBoRoute, routeWithQueryParams } from 'utils/helpers';
import styles from 'utils/style/Home.module.scss';
import type { SetShowLegacy } from 'types/global-types';
import type { Pages } from 'types/route-types';
import { useAppSelector } from 'redux/hooks';
import { getMenuItems } from 'utils/menu-items';
import {
  Dropdown,
  Grid,
  Icon,
  Item,
  Menu,
  Segment,
} from 'semantic-ui-react';
import type { MenuItemOrFolder, MenuItemHeader } from 'types/menu-items-types';
import { SidebarMenuSections } from 'types/menu-items-types';
import chunk from 'lodash/chunk';
import { v4 as uuidv4 } from 'uuid';

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy;
  viewId: Pages;
}

const Home: FC<Props> = ({ setShowLegacy, viewId }) => {
  const userRoles = useAppSelector(({ metadataReducer }) => metadataReducer.roles);
  const navItems = getMenuItems(userRoles, true);

  const getDropdownItems = (navItem: MenuItemHeader) => {
    if (navItem?.dropdownData) {
      const dropdownDataSectionItems: MenuItemOrFolder[] = [];
      dropdownDataSectionItems.push(
        ...(navItem.dropdownData[SidebarMenuSections.SECTION_ONE]?.items ?? []),
        ...(navItem.dropdownData[SidebarMenuSections.SECTION_TWO]?.items ?? []),
      );
      return dropdownDataSectionItems;
    }
  };

  const content = useMemo(
    () => (
      <Grid stackable container columns={3}>
        {chunk(navItems, 3).map((navGridRow) => (
          <Grid.Row key={uuidv4()} stretched>
            {navGridRow.map((item) => (
              <Grid.Column key={item.id}>
                <Segment
                  className={styles.segment}
                  as={item.toPath ? Link : 'div'}
                  to={routeWithQueryParams(item.toPath)}
                >
                  <Grid padded>
                    <Grid.Row verticalAlign="middle" style={item?.dropdownData && { marginBottom: '2em' }}>
                      <Grid.Column width={3}>
                        <Icon color="teal" name={item.icon} size="big" />
                      </Grid.Column>
                      <Grid.Column width={13}>
                        <Item.Group className={styles.itemGroup}>
                          <Item>
                            <Item.Content>
                              <Item.Header>{item.label}</Item.Header>
                              <Item.Description>{item.description}</Item.Description>
                            </Item.Content>
                          </Item>
                        </Item.Group>
                      </Grid.Column>
                    </Grid.Row>
                    {item?.dropdownData && (
                      <div className={styles.dropdown}>
                        <Menu size="small">
                          <Dropdown text={item.label ? `Use ${item.label}` : '...'} item simple scrolling>
                            <Dropdown.Menu>
                              {getDropdownItems(item)?.map((dropdownItem) => (
                                <div key={dropdownItem.id}>
                                  {dropdownItem.toPath && (
                                    <Dropdown.Item
                                      key={dropdownItem.id}
                                      as={Link}
                                      to={routeWithQueryParams(dropdownItem.toPath)}
                                    >
                                      {dropdownItem.label}
                                    </Dropdown.Item>
                                  )}
                                  {dropdownItem.subItems
                                    && dropdownItem.subItems.map((subItem) => (
                                      <Dropdown.Item
                                        key={subItem.id}
                                        as={Link}
                                        to={routeWithQueryParams(subItem.toPath)}
                                      >
                                        {subItem.label}
                                      </Dropdown.Item>
                                    ))}
                                </div>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Menu>
                      </div>
                    )}
                  </Grid>
                </Segment>
              </Grid.Column>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    ),
    [navItems],
  );

  // location options are automatically passed in to props via <Route />
  // Conditionally render own content / update legacybackoffice path
  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !content);
  }, [content, setShowLegacy, viewId]);

  return content;
};

export default Home;
