/*
  This component is a super user feature that allows you to quick-navigate to any page
  registered in menu-items.ts. This component is shown when the user clicks a short-command
  or clicks to icon in header. An input shows where the user can search for a page. A filtered list
  of all pages are shown an the user can quick navigate to on of them by selecting with arrow + clicking enter
  or clicking the page on screen.
*/

import { useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Dropdown, Icon } from 'semantic-ui-react';
import { contextActions } from 'redux/actions';
import type {
  MenuItem,
  MenuItemHeader,
  MenuItemSubItemSections,
  MenuItemOrFolder,
} from 'types/menu-items-types';
import { getMenuItems } from 'utils/menu-items';
import { HorisontalSpacer } from 'components/help-components/Spacers';
import type { PaymentIqRoles } from 'types/service/metadata';
import { Pages } from 'types/route-types';
import { getOsModifierKey } from 'utils/helpers';

interface Props {
  toggleShowHandler: (show: boolean) => void
}

const QuickNavigation: FC<Props> = (props): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { activePage } = useAppSelector(({ contextReducer }) => contextReducer);
  const userRoles:PaymentIqRoles[] = useAppSelector(({ metadataReducer }) => metadataReducer.roles);

  const { quickNavOptions, initActivePageIndex } = formatMenuItems(activePage, userRoles);
  const [activePageIndex, setActivePageIndex] = useState<number>(initActivePageIndex);

  const handleSetSelectedPage = (option: any): void => {
    // value is the index
    const selectedOption = quickNavOptions[option.value];
    dispatch(contextActions.setActivePage((selectedOption && selectedOption.key) || Pages.HOME));
    setActivePageIndex(option.value);
    if (selectedOption && selectedOption.to) {
      history.push(selectedOption.to);
    }
    props.toggleShowHandler(false);
  };

  const handleClose = () => {
    props.toggleShowHandler(false);
  };

  const getQuickNavOptions = (): Array<any> => quickNavOptions.filter((val) => val) || [];

  return (
    <>
      <Dropdown
        placeholder="Filter pages"
        value={activePageIndex}
        options={getQuickNavOptions()}
        selectOnNavigation={false}
        searchInput={{ autoFocus: true }}
        style={{ width: '200px', position: 'relative', zIndex: '100000' }}
        className="quick-navigation-dropdown-menu"
        search
        fluid
        header={<Dropdown.Header icon="tags" content={`Use ${getOsModifierKey()}+K to open quick navigation`} />}
        onBlur={() => props.toggleShowHandler(false)}
        onClose={() => handleClose()}
        onChange={(e: SyntheticEvent, option: any) => handleSetSelectedPage(option)}
      />
      <HorisontalSpacer factor={2} />
      <Icon
        className="cursor-pointer"
        title={`${getOsModifierKey()} + K to open`}
        name="close"
        size="large"
        onClick={() => props.toggleShowHandler(false)}
      />
    </>
  );
};

const flattenAllMenuSubItems = (section: MenuItemSubItemSections): (MenuItem)[] => {
  const returnItems: (MenuItem| MenuItemOrFolder)[] = [];
  section.items.forEach((subItem: MenuItemOrFolder) => {
    if (subItem.toPath) {
      returnItems.push(subItem);
    }
    if (subItem.subItems) {
      subItem.subItems.forEach((subSubItem) => {
        if (subSubItem.toPath) {
          returnItems.push(subSubItem);
        }
      });
    }
  });
  return returnItems;
};

const flattenMenuItems = (menuItems: MenuItemHeader[]) => {
  const results: (MenuItem)[] = [];
  menuItems.forEach((item) => {
    if (item.toPath) {
      results.push(item);
    }
    if (item.dropdownData) {
      if (item.dropdownData.sectionOne) {
        results.push(...flattenAllMenuSubItems(item.dropdownData.sectionOne));
      }
      if (item.dropdownData.sectionTwo) {
        results.push(...flattenAllMenuSubItems(item.dropdownData.sectionTwo));
      }
    }
  });
  return results;
};

const formatMenuItems = (activePage: string, userRoles:PaymentIqRoles[]) => {
  const menuItems = flattenMenuItems(getMenuItems(userRoles));
  const quickNavOptions = menuItems.map(((menuItem, index) => ({
    key: menuItem.id,
    to: menuItem.toPath,
    text: menuItem.label,
    value: index,
  })));

  const initActivePageIndex = quickNavOptions.find((option) => (option && option.key) === activePage);
  return {
    quickNavOptions,
    initActivePageIndex: (initActivePageIndex && initActivePageIndex.value) || 0,
  };
};

export default QuickNavigation;
