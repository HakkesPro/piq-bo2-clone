import type { RootState } from './store';

// This file might be unnecessary as we could do this inline like..
// const merchantId = useAppSelector(({ defaultReducer }) => defaultReducer.merchantId)'

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const state = (state: RootState) => state;
// More convenient to do this inline i think
// export const merchantId = ({ defaultReducer }) => defaultReducer.merchantId
// export const userId = ({ defaultReducer }) => defaultReducer.userId
