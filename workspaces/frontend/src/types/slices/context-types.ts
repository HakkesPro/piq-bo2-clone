import type { MerchantId } from 'types/global-types';
import type { Pages } from 'types/route-types';

export interface State {
  merchantId: MerchantId,
  userName: string,
  accountUrl: string | null,
  showDesktopSidebar: boolean,
  activePage: Pages,
  totalRowsPerTablePage: number
}

export const totalRowsPerTablePageOptions = [
  {
    key: '1',
    value: 100,
    text: '100',
  },
  {
    key: '2',
    value: 500,
    text: '500',
  },
  {
    key: '3',
    value: 1000,
    text: '1000',
  },
];
