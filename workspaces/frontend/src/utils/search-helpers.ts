import type {
  ColumnItem,
  SearchData,
  SearchItem,
} from 'types/global-types';
import { hideColumnSuffix, columnId } from '@paymentiq-backoffice-2/shared';
import { filter, escapeRegExp } from 'lodash';

export const getResult = (columnsData: Array<ColumnItem>, inputValue: string): SearchData => {
  const searchData = formatSearchData(columnsData);

  const inputValueRegExp = new RegExp(escapeRegExp(inputValue.toLowerCase()), 'i');

  const isMatch = (result: any) => inputValueRegExp.test(result.title.toLowerCase());
  const result: SearchData = filter([...searchData], isMatch);

  const compareResults: string[] = [];
  const uniqueResults = result.filter((resultItems: SearchItem) => {
    if (!compareResults.includes(resultItems.title)) {
      compareResults.push(resultItems.title);
      return result;
    }
    compareResults.push(resultItems.title);
    return null;
  });

  return uniqueResults;
};

export const searchResultColumns = (columnsData: Array<ColumnItem>, inputValue: string) => {
  const result = getResult(columnsData, inputValue);

  const resultColumns: Array<ColumnItem> = getFilteredColumns(
    columnsData,
    inputValue,
  );

  return {
    result,
    data: resultColumns,
    total: resultColumns[0].data.length,
  };
};

const formatSearchData = (columnsData: Array<ColumnItem>) => {
  const addedItems: string[] = [];
  const searchData: SearchData = [];
  const splitBy = '__';
  const allItemsFlattened = columnsData.map((columnItem: ColumnItem) => {
    const dataPrefixed = columnItem.data.map((val: string) => `${val}${splitBy}${columnItem.title}`);
    return [...dataPrefixed];
  }).flat();

  allItemsFlattened.forEach((val: string) => {
    const value = val.split(splitBy)[0];
    const key = val.split(splitBy)[1];
    if (!addedItems.includes(val) && !value.endsWith('.png') && key !== 'ID') { // avoid double values in search
      addedItems.push(val);
      searchData.push({
        title: val.split(splitBy)[0],
        description: val.split(splitBy)[1],
      });
    }
  });
  return searchData;
};

const getFilteredColumns = (columns: Array<ColumnItem>, result: string): Array<ColumnItem> => {
  const addedColumnsCompare: string[] = [];
  const resultData: Array<ColumnItem> = [...columns].map((v) => ({
    title: v.title,
    data: [],
  }));

  if (result.length === 0) return columns;

  // This was a bit messy, but need to filter out so there are no doubles, also should perhaps move this to backend
  columns.forEach((column) => {
    column.data.forEach((dataItem, dataIndex) => {
      if (dataItem.toLowerCase().includes(result.toLowerCase())
        && column.title !== `${columnId}${hideColumnSuffix}`
        && !dataItem.endsWith('.png')) {
        let compareString = '';
        const holdData: string[] = [];
        resultData.forEach((col, index) => {
          holdData.push(columns[index].data[dataIndex]);
          compareString = `${compareString}-${columns[index].data[dataIndex]}`;
        });
        if (!addedColumnsCompare.includes(compareString)) {
          holdData.forEach((val, i) => { resultData[i].data.push(val); });
        }
        addedColumnsCompare.push(compareString);
      }
    });
  });

  return resultData;
};
