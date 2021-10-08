import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PaymentIqRoles } from 'types/service/metadata';
import type { State, Merchants } from 'types/slices/metadata-types';

const initialState: State = {
  roles: [],
  merchants: [],
};

const defaultState = createSlice({
  name: 'metadata',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRoles: (state, action: PayloadAction<PaymentIqRoles[]>) => {
      state.roles = action.payload;
    },
    setMerchants: (state, action: PayloadAction<Merchants>) => {
      state.merchants = action.payload;
    },
  },
});

export const metadataActions = { ...defaultState.actions };

export default defaultState.reducer;
