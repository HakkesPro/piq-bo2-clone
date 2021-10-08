import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getSelectedMerchantId } from 'utils/helpers';
import { Pages } from 'types/route-types';
import type { State } from 'types/slices/context-types';
import { totalRowsPerTablePageOptions } from 'types/slices/context-types';

const initialState: State = {
  merchantId: getSelectedMerchantId() || 0, // default to 0
  userName: '',
  accountUrl: null,
  showDesktopSidebar: true,
  activePage: Pages.HOME,
  totalRowsPerTablePage: totalRowsPerTablePageOptions[0].value,
};

const defaultState = createSlice({
  name: 'default',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMerchantId: (state, action: PayloadAction<number>) => {
      state.merchantId = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setAccountUrl: (state, action: PayloadAction<string>) => {
      state.accountUrl = action.payload;
    },
    setShowDesktopSidebar: (state, action: PayloadAction<boolean>) => {
      state.showDesktopSidebar = action.payload;
    },
    setActivePage: (state, action: PayloadAction<Pages>) => {
      state.activePage = action.payload;
    },
    setTotalRowsPerTablePage: (state, action: PayloadAction<number>) => {
      state.totalRowsPerTablePage = action.payload;
    },
  },
});

export const contextActions = { ...defaultState.actions };

export default defaultState.reducer;
