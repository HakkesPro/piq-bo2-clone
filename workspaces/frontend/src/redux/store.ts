import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import contextReducer from './slices/context';
import metadataReducer from './slices/metadata';

export const store = configureStore({
  reducer: {
    // Here we can specify multiple reducers and they will be merged into one
    contextReducer,
    metadataReducer,
  },
});

// Some ts types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
