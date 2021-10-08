import { useState } from 'react';
import type {
  ColumnItem,
} from 'types/global-types';
import { useBetween } from 'use-between';

const useColumns = () => {
  const [columns, setColumns] = useState([] as null|ColumnItem[]);
  return {
    columns,
    setColumns,
  };
};
export const useColumnsData = () => useBetween(useColumns);
