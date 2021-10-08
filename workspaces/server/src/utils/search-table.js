import { hideColumnSuffix, columnId } from '@paymentiq-backoffice-2/shared';
import pkg from 'lodash';
const { filter, escapeRegExp } = pkg;

export const getResult = (columnsData, searchInput) => {
  const searchData = formatSearchData(columnsData);

  const searchInputRegExp = new RegExp(escapeRegExp(searchInput.toLowerCase()), 'i');

  const isMatch = (result) => searchInputRegExp.test(result.title.toLowerCase());
  const result = filter([...searchData], isMatch);

  const compareResults = [];
  const uniqueResults = result.filter((resultItems) => {
    if (!compareResults.includes(resultItems.title)) {
      compareResults.push(resultItems.title);
      return result;
    }
    compareResults.push(resultItems.title);
    return null;
  });

  return uniqueResults;
};

export const filterBySearchInput = (columnsData, searchInput) => {
  const result = getResult(columnsData, searchInput);

  const resultColumns = getFilteredColumns(
    columnsData,
    searchInput,
  );

  return {
    result,
    total: resultColumns[0].data.length,
    data: resultColumns,
  };
};

const formatSearchData = (columnsData) => {
  const addedItems = [];
  const searchData = [];
  const splitBy = '__';
  const allItemsFlattened = columnsData.map((columnItem) => {
    const dataPrefixed = columnItem.data.map((val) => `${val}${splitBy}${columnItem.title}`);
    return [...dataPrefixed];
  }).flat();

  allItemsFlattened.forEach((val) => {
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

const getFilteredColumns = (columns, result) => {
  const addedColumnsCompare = [];
  const resultData = [...columns].map((v) => ({
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
        const holdData = [];
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
