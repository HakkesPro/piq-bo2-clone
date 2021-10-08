import type { FC, SyntheticEvent } from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  Input,
} from 'semantic-ui-react';
import type {
  ColumnItemData,
  ColumnItem,
} from 'types/global-types';
import { hideColumnSuffix } from '@paymentiq-backoffice-2/shared';

interface Props {
  columns: Array<ColumnItem>,
  handleClick: (e: SyntheticEvent) => void,
  editable?: boolean
  handleUpdate?: (val: any) => void
}

const TableBodyContent:FC<Props> = ({
  columns,
  handleClick,
  editable = false,
  handleUpdate,
}) => {
  const columnSections = columns[0];
  const bodyContent = () => (
    Array.isArray(columnSections.data) ? columnSections.data.map((data: ColumnItemData, index: number) => (
      <Table.Row key={uuidv4()}>
        {
          columns.map((column) => !column.title.includes(hideColumnSuffix) && (
            <TableRow
              text={column.data[index]}
              key={column.title}
              column={column}
              columns={columns}
              index={index}
              handleClick={handleClick}
              editable={editable}
              handleUpdate={handleUpdate}
            />
          ))
        }
      </Table.Row>
    )) : (
      <Table.Row key={uuidv4()}>
        {
          columns.map((column) => !column.title.includes(hideColumnSuffix) && (
            <TableRow
              text={column.data.toString()}
              key={column.title}
              column={column}
              columns={columns}
              index={0}
              handleClick={handleClick}
              editable={editable}
              handleUpdate={handleUpdate}
            />
          ))
        }
      </Table.Row>
    ));

  return (
    <>
      {columnSections && columnSections.data && bodyContent()}
    </>
  );
};

interface TableRowProps extends Props {
  index: number
  column: ColumnItem
  text: string,
}

const TableRow:FC<TableRowProps> = ({
  column,
  columns,
  index,
  handleClick,
  text,
  editable,
  handleUpdate,
}) => {
  const handleInputUpdate = (val: string) => {
    const clickedRow = handleCellClick(columns, index, undefined);
    const updatedRow = clickedRow.map((row) => {
      if (row.title === column.title) {
        return {
          title: row.title,
          data: val,
        };
      }
      return row;
    });
    if (handleUpdate) {
      handleUpdate({
        clickedRow,
        index,
        inputValue: val,
        updatedRow,
      });
    }
  };

  return (
    <Table.Cell
      id="table-cell-container"
      onClick={() => handleCellClick(columns, index, handleClick)}
      style={{ cursor: 'pointer' }}
      key={uuidv4()}
    >
      { editable ? <TableCellInput handleUpdate={handleInputUpdate} value={text} /> : renderColumItem(text) }
    </Table.Cell>
  );
};

interface TableCellInputProps {
  value: string
  handleUpdate: (val: any) => void
}
const TableCellInput:FC<TableCellInputProps> = ({ value, handleUpdate }) => {
  const [text, setText] = useState(value);

  const handleChange = (newVal: string) => {
    setText(newVal);
    if (handleUpdate) handleUpdate(newVal);
  };

  return (
    <Input onChange={(e, data) => handleChange(data.value)} value={text} />
  );
};

const handleCellClick = (columns: Array<ColumnItem>, index: number, handleClick: undefined|((e: any) => void)) => {
  const clickedRow: Array<{ title: string, data: string }> = columns.map((column) => ({
    title: column.title.replace(hideColumnSuffix, ''),
    data: column.data[index],
  }));
  if (handleClick) handleClick(clickedRow);
  return clickedRow;
};

const renderColumItem = (data: string) => {
  if (data && data.endsWith('.png')) {
    return (
      <img
        alt="Logo"
        src={data}
        style={{ maxHeight: '30px', maxWidth: '40px' }}
      />
    );
  }
  return data;
};

export default TableBodyContent;
