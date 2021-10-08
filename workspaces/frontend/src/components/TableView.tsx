/* eslint-disable no-underscore-dangle */
import type { FC } from 'react';
import { useMemo, useState, useEffect } from 'react';
import {
  Menu,
  Table,
  Grid,
  Pagination,
  Dropdown,
  Popup,
  Dimmer,
  Loader,
  Button,
} from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { contextActions } from 'redux/actions';
import type {
  ColumnItem,
  GenerateTableColumnsData,
  CustomActionButton,
  DropdownOption,
} from 'types/global-types';
import { hideColumnSuffix } from '@paymentiq-backoffice-2/shared';
import SearchBar from 'components/SearchBar';
import { v4 as uuidv4 } from 'uuid';
import { totalRowsPerTablePageOptions } from 'types/slices/context-types';
import TableBodyContent from './TableBodyContent';
import { useColumnsData } from 'utils/hooks/general-hooks';

declare global {
  interface Window {
    __isFetchingTableData: boolean
    __searchInputValue: undefined|string
  }
}

type HandleClick = (p: any) => void
interface Props {
  title: string,
  handleClick: HandleClick,
  getColumns: (
    startIndex: number,
    endIndex: undefined|number,
    searchInputValue?: string,
  ) => Promise<GenerateTableColumnsData>,
  customActionsDropdown?: CustomActionButton
}

const TableView: FC<Props> = ({
  title,
  handleClick,
  getColumns,
  customActionsDropdown,
}) => {
  const dispatch = useAppDispatch();
  const totalRowsPerTablePage = useAppSelector(({ contextReducer }) => contextReducer.totalRowsPerTablePage);

  const { columns, setColumns } = useColumnsData();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    window.__searchInputValue = undefined;
  }, []);

  const fetchNewTableCallback = ({ data, total }: GenerateTableColumnsData) => {
    setTotalData(total);
    setColumns(data);
    setIsLoadingData(false);
    window.__isFetchingTableData = false;
  };

  useEffect(() => {
    const { startIndex, endIndex } = getIndex(currentPage, totalRowsPerTablePage);
    // Using window value here since we don't want a re-render or a depedency here
    if (!window.__isFetchingTableData) {
      fetchNewTableData(getColumns, startIndex, endIndex, setIsLoadingData)
        .then(fetchNewTableCallback);
    }
    window.__isFetchingTableData = true;
  }, [getColumns, currentPage, totalRowsPerTablePage]);

  const resetColumns = async () =>
    fetchNewTableData(getColumns, 0, totalRowsPerTablePage, setIsLoadingData)
      .then(fetchNewTableCallback);

  const setTableDataCallback = async (resultColumns: null|Array<ColumnItem>, total: number) => {
    window.__isFetchingTableData = true;
    setCurrentPage(1);
    setColumns(resultColumns);
    if (resultColumns) {
      setTotalData(total);
    } else {
      await resetColumns();
    }
    window.__isFetchingTableData = false;
  };

  return (
    <div id="table-view-container">

      <div
        id="empty-white-space"
        style={{
          top: 0,
          position: 'absolute',
          height: '177px',
          width: '100vw',
          background: '#ffffff',
        }}
      />

      <Menu style={{ position: 'sticky', top: '14px' }}>
        <Menu.Item>
          <SearchBar
            placeholder={title}
            getColumns={getColumns}
            setTableDataCallback={setTableDataCallback}
          />
        </Menu.Item>
        <Menu.Item position="left">
          <Grid.Row>
            <Grid.Column width={3}>
              <h4 className="align-center">{totalData}</h4>
            </Grid.Column>
            <Grid.Column width={13}>
              <p className="align-center">Total</p>
            </Grid.Column>
          </Grid.Row>
        </Menu.Item>

        {customActionsDropdown && (
          <Menu.Item fitted position="right" id="custom-action-btn">
            <Button.Group color="teal">
              <Button
                disabled={!customActionsDropdown.disabledBtn()}
                onClick={() => console.log('customActionsDropdown click')}
                loading={customActionsDropdown.isLoadingBtn()}
              >
                {customActionsDropdown.name}
              </Button>
              <Dropdown floating trigger={<></>} className="button icon">
                <Dropdown.Menu>
                  { customActionsDropdown.options.map((optionOrArray, i) => {
                    if (Array.isArray(optionOrArray)) {
                      return optionOrArray.map((option, optionIndex) => (i > 0 && optionIndex === 0
                        ? (
                          <DropDownItemAndDivider
                            _key={option.key}
                            icon={option.icon}
                            key={Math.random()}
                            text={option.text}
                            value={option.value}
                            onClick={customActionsDropdown.onClick}
                          />
                        )
                        : (
                          <Dropdown.Item
                            key={option.key}
                            icon={option.icon}
                            text={option.text}
                            value={option.value}
                            onClick={customActionsDropdown.onClick}
                          />
                        )
                      ));
                    }
                    return (
                      <Dropdown.Item
                        key={optionOrArray.key}
                        icon={optionOrArray.icon}
                        text={optionOrArray.text}
                        value={optionOrArray.value}
                        onClick={customActionsDropdown.onClick}
                      />
                    );
                  }) }
                </Dropdown.Menu>
              </Dropdown>
            </Button.Group>
          </Menu.Item>
        )}

        <Menu.Item id="pagination-container" position="right">
          <Popup
            content="Total rows per page"
            trigger={(
              <Dropdown
                style={{ marginRight: '30px' }}
                defaultValue={totalRowsPerTablePage}
                onChange={(e, data) => dispatch(contextActions.setTotalRowsPerTablePage(Number(data.value)))}
                options={totalRowsPerTablePageOptions}
              />
            )}
          />
          <Pagination
            activePage={currentPage}
            onPageChange={(e, data) => setCurrentPage(Number(data.activePage))}
            totalPages={Math.ceil(totalData / totalRowsPerTablePage)}
          />
        </Menu.Item>
      </Menu>

      { (isLoadingData || !columns) && <FetchingData /> }

      {useMemo(() => (
        <Table
          celled
          sortable
          selectable
          compact
        >

          <Table.Header>
            <Table.Row
              style={{
                position: 'sticky',
                top: '95px',
                boxShadow: '0 0 3px 1px rgb(34 36 38 / 15%',
              }}
            >
              {columns && columns.map((item) => !item.title.includes(hideColumnSuffix) && (
              <Table.HeaderCell
                style={{ borderTop: '1px solid #eeeeef' }}
                key={uuidv4()}
              >{item.title}
              </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body style={{ maxHeight: '150px!important' }}>
            { columns && <TableBodyContent columns={columns} handleClick={handleClick} /> }
          </Table.Body>
        </Table>
      ), [columns, handleClick])}

    </div>
  );
};

const FetchingData:FC = () => (
  <div id="table-loading-container">
    <Dimmer active>
      <Loader>Fetching data ...</Loader>
    </Dimmer>
  </div>
);

const fetchNewTableData = async (
  getNewColumns: (startIndex: number, endIndex: number, searchInput?: undefined|string) => Promise<GenerateTableColumnsData>,
  startIndex: number,
  endIndex: number,
  setIsLoadingData: (boo: boolean) => void,
) => {
  setIsLoadingData(true);
  // eslint-disable-next-line no-underscore-dangle
  const newColums = await getNewColumns(startIndex, endIndex, window.__searchInputValue);
  return newColums;
};

const getIndex = (currentPage: number, totalRowsPerTablePage: number) => {
  const startIndex = (currentPage - 1) * totalRowsPerTablePage;
  const endIndex = currentPage * totalRowsPerTablePage;
  return { startIndex, endIndex };
};

interface DropDownItemAndDividerProps extends Omit<DropdownOption, 'key'> {
  _key: string,
  onClick: CustomActionButton['onClick']
}
const DropDownItemAndDivider:FC<DropDownItemAndDividerProps> = ({
  _key,
  value,
  text,
  icon,
  onClick,
}) => (
  <>
    <Dropdown.Divider />
    <Dropdown.Item onClick={onClick} key={_key} value={value} icon={icon} text={text} />
  </>
);

export default TableView;
