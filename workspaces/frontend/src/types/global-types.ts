import type { SyntheticEvent } from 'react';
import type { GeneralMetaData } from 'types/service/metadata';

export type MerchantId = number;

export interface AuthStatus {
  isAuthenticated: boolean;
  authPath?: string;
  metadata?: GeneralMetaData;
  statusCode?: number;
}

export type FontSize = {
  textXs: '0.75rem';
  textSm: '0.875rem';
  textBase: '0.938rem';
  textLg: '1.125rem';
  textXl: '1.25rem';
  text2xl: '1.563rem';
  text3xl: '1.875rem';
  text4xl: '2.25rem';
  text5xl: '3rem';
};

export enum FixedSizes {
  sidebarWidth = 275, // Must match the width specified an App.scss $SIDEBAR_WIDTH
  headerHeight = 65,
  footerHeight = 30,
}

export type SetShowLegacy = (boo: boolean) => void;

export interface MonacoEditorRef {
  current: {
    getValue: (value: string) => void;
  };
}

export enum Users {
  YOU = 'you',
  OTHERS = 'others',
  ALL = 'anyone',
}

export enum Locales {
  ENGLISH = 'en',
  ENGLISH_BRITAIN = 'en_GB',
  ENGLISH_US = 'en_US',
  SWEDISH = 'sv_SE',
  DANISH = 'da_DK',
  GERMAN = 'de',
  GERMANY_GERMANY = 'de_DE',
  FINNISH = 'fi_FI',
  NORWEGIAN_NORWAY = 'no_NO',
  PORTUGUESE_PORTUGAL = 'pt_PT',
}

export interface GenerateTableColumnsDataItem { title: string, data: string, hide?: boolean }
export type ColumnItemData = string
export type ColumnData = Array<ColumnItemData>
export interface ColumnItem {
  title: string,
  data: ColumnData
}

export interface GenerateTableColumnsData {
  data: Array<ColumnItem>
  total: number
  result?: SearchData
}

export interface SearchItem {
  title: string,
  description: string
}
export type SearchData = Array<SearchItem>

export interface DropdownOption {
  key: string;
  text: string;
  value: string | number;
  icon?: string,
  disabled?: boolean;
}
export interface CustomActionButton {
  name: string,
  options: Array<DropdownOption>|Array<Array<DropdownOption>>
  disabledBtn: () => boolean,
  isLoadingBtn: () => boolean,
  onClick: (e: SyntheticEvent, value: any) => void,
}
