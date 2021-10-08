import type { FC } from 'react';
import {
  useEffect,
  useRef,
  useReducer,
  memo,
} from 'react';
import { Search } from 'semantic-ui-react';
import type {
  ColumnItem,
  GenerateTableColumnsData,
  SearchData,
} from 'types/global-types';
import { useAppSelector } from 'redux/hooks';

const initialState = {
  isLoading: false,
  results: [],
  value: '',
};

const reducer = (state: typeof initialState, action: any) => {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState;
    case 'START_SEARCH':
      return { ...state, isLoading: true, value: action.query };
    case 'FINISH_SEARCH':
      return { ...state, isLoading: false, results: action.results };
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection };

    default:
      throw new Error();
  }
};

declare global {
  interface Window {
    __searchInputValue: undefined|string;
  }
}

interface Props {
  getColumns: (
    startIndex: number,
    endIndex: undefined|number,
    searchInputValue: string) => Promise<GenerateTableColumnsData>,
  placeholder?: string,
  setTableDataCallback: (resultData: null|Array<ColumnItem>, total: number) => void,
}

const SearchBar:FC<Props> = ({
  getColumns,
  placeholder,
  setTableDataCallback,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const totalRowsPerTablePage = useAppSelector(({ contextReducer }) => contextReducer.totalRowsPerTablePage);

  const { isLoading, results, value } = state;

  const timeoutRef: { current: any } = useRef();

  const finishSearch = (resultColumns: ColumnItem[], total: number, result: SearchData) => {
    setTableDataCallback(resultColumns, total);
    dispatch({
      type: 'FINISH_SEARCH',
      results: result,
    });
  };

  const handleSearchChange = (e: any, data: any, timeout = 300) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: 'START_SEARCH', query: data.value });

    const inputValue = (data.result && data.result.title) ? data.result.title : data.value;
    // eslint-disable-next-line no-underscore-dangle
    window.__searchInputValue = inputValue;

    timeoutRef.current = setTimeout(async () => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' });
        setTableDataCallback(null, 0); // Will fallback to displaying the first page
        return;
      }

      const columnsData = await getColumns(0, totalRowsPerTablePage, inputValue);

      finishSearch(
        columnsData.data,
        columnsData.total,
        columnsData.result!,
      );
    }, timeout);
  };

  useEffect(() => () => {
    clearTimeout(timeoutRef.current);
  }, []);

  const onResultSelect = (e: any, data: any) => {
    handleSearchChange(e, data, 0);
    dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title });
  };

  return (
    <div id="search-table-container">
      <Search
        placeholder={placeholder}
        loading={isLoading}
        onResultSelect={onResultSelect}
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
      />
    </div>
  );
};

export default memo(SearchBar);
