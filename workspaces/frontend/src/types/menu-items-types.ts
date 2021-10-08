import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';
import type { PaymentIqRoles } from 'types/service/metadata';
import type { SetShowLegacy } from 'types/global-types';
import type { Pages } from 'types/route-types';

type StringOrNull = string | null;

export enum SidebarMenuSections {
  SECTION_ONE = 'sectionOne',
  SECTION_TWO = 'sectionTwo',
}

interface Cmpnt extends RouteComponentProps {
  setShowLegacy: SetShowLegacy;
  viewId: Pages;
}

export interface MenuItem {
  label: StringOrNull;
  description?: string;
  id: Pages; // change to only accept Pages
  validRoles: PaymentIqRoles[] | null;
  invalidRoles?: PaymentIqRoles[] | null;
  toPath?: string;
  legacyPath?: string;
  isAllowed?: boolean;
  cmpnt?: FC<Cmpnt>;
  icon?: string | any;
}

export interface MenuItemOrFolder extends MenuItem {
  subItems?: MenuItem[];
}
// export interface HeaderDropDownDataItems extends SidebarMenuItem {
//   subItems?: Array<SidebarMenuItem>
// }

export interface MenuItemSubItemSections {
  label: StringOrNull;
  validRoles: PaymentIqRoles[] | null;
  invalidRoles?: PaymentIqRoles[] | null;
  items: MenuItemOrFolder[];
  isAllowed?: boolean;
}

type MenuItemSubItems = Record<string, MenuItemSubItemSections>;

export interface MenuItemHeader extends MenuItem {
  dropdownData?: Partial<MenuItemSubItems>;
}

export const BACKOFFICE_ROLES = {};
