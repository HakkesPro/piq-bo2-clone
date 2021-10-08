import { hideColumnSuffix, columnId } from '@paymentiq-backoffice-2/shared';
import { filterBySearchInput } from '../utils/search-table.js'

const formatTableData = (
  tableDataPar,
  sliceStart,
  sliceEnd, // When undefined .. no slice is made if sliceStart has 0 index.
  searchInput, // Can add a search input, if so, filter by this search string.
) => {
  const tableData = tableDataPar || []; // Adding default here instead since it could be null|false and not just undefined
  let newData = [];
  // eslint-disable-next-line no-unused-expressions
  tableData[0] && tableData[0].forEach((val) => {
    newData.push({
      title: val.title,
      data: [],
    });
  });

  const dataFlattened = tableData.flat();
  dataFlattened.forEach((val) => {
    newData.forEach((column) => {
      if (column.title === val.title) {
        column.data.push(val.data);
      }
    });
  });

  let slimmedData = newData;

  let searchResult = null
  let searchTotal = null
  if (searchInput) {
    const { result, total, data } = filterBySearchInput(newData, searchInput)
    searchResult = result
    searchTotal = total
    newData = data
  }

  // Slice the data
  if (sliceStart || sliceEnd) {
    console.log('Will slice data now:')
    console.log(sliceStart)
    console.log(sliceEnd)
    slimmedData = newData.map((val) => ({
      title: val.title,
      data: val.data.slice(sliceStart, sliceEnd === 'undefined' ? undefined : sliceEnd),
    }));
  }

  const columns = slimmedData.length > 0 ? slimmedData : [{
    title: 'null',
    data: ['null', 'null', 'null'],
  }];

  const hiddenColumns = tableData[0].filter((v) => v.hide).map((v) => v.title);
  if (hiddenColumns.length > 0) {
    columns.forEach((column) => {
      if (hiddenColumns.includes(column.title)) {
        column.title = `${column.title}${hideColumnSuffix}`;
      }
    });
  }

  return {
    ...searchResult && { result: searchResult },
    data: columns,
    total: searchTotal || (newData[0] ? newData[0].data.length : 0),
  };
};

export const formatMessages = (messages, startIndex = 0, endIndex, searchInput) => {
  const addFields = messages && messages.map((messageItem) => {
    const toString = (item) => {
      try {
        return item.toString();
      } catch {
        return '';
      }
    };

    return [
      {
        title: 'Key',
        data: toString(messageItem.key),
      },
      {
        title: 'Category',
        data: toString(messageItem.category),
      },
      {
        title: 'Locale',
        data: toString(messageItem.locale),
      },
      {
        title: 'Displayed text',
        data: toString(messageItem.value),
      },
      {
        title: 'Description',
        data: toString(messageItem.description),
      },
      {
        title: 'Last updated',
        data: toString(messageItem.lastUpdated),
      },
      {
        title: 'Merchant ID',
        data: toString(messageItem.merchantId),
      },
      {
        title: columnId,
        data: toString(messageItem.id),
        hide: true,
      },
    ];
  })
  return formatTableData(addFields, startIndex, endIndex, searchInput);
}
