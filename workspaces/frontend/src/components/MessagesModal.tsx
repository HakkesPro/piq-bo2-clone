import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Modal,
  Table,
  Grid,
  Popup,
} from 'semantic-ui-react';
import type {
  ColumnItem,
} from 'types/global-types';
import type { MerchantMessagesPayload, MerchantMessages } from 'types/service/general-service-types';
import TableBodyContent from './TableBodyContent';
import { cloneDeep } from 'lodash';
import { updateMerchantMessages } from 'service/general-apis/general-service';
import { useColumnsData } from 'utils/hooks/general-hooks';
import { mergeTableData } from 'utils/helpers';

interface Props {
  open: boolean,
  setOpen: (boo: boolean) => void,
  allData: ColumnItem[],
  pageTitle: string,
  merchantId: number
  editable?: boolean
  setLatestMessagesData: (latestData: ColumnItem[]) => void
}

enum UpdateStatuses {
  SUCCESS = 'success',
  FAILED = 'failed',
}

const MessagesModal:FC<Props> = ({
  open,
  setOpen,
  allData,
  pageTitle,
  editable = false,
  setLatestMessagesData,
}): JSX.Element => {
  const [hasMadeChanges, setHasMadeChanges] = useState(false);
  const [isUpdatingNewData, setIsUpdatingNewData] = useState(false);
  const [newData, setNewData] = useState([] as ColumnItem[]);
  const [updatedData, setUpdatedData] = useState([] as ColumnItem[]);
  const [updateStatus, setUpdateStatus] = useState(null as null|UpdateStatuses);

  const { columns, setColumns } = useColumnsData();

  type DataToDisplay = (data: ColumnItem[]) => ColumnItem[];
  const dataToDisplay: DataToDisplay = (data) => data.filter((v) => dataToRenderToModal.includes(v.title));

  useEffect(() => {
    setNewData(allData);
  }, [allData]);

  type GetDiffMessagesOnly = (updated: ColumnItem[]) => ColumnItem[]
  const getDiffMessagesOnly: GetDiffMessagesOnly = (updated) => {
    const result: ColumnItem[] = updated.map((v) => ({ title: v.title, data: [] }));
    updated.forEach((d, i) => {
      d.data.forEach((val, valIndex) => {
        if (allData[i].data[valIndex] !== val) {
          result.forEach((r, rIndex) => {
            r.data.push(updated[rIndex].data[valIndex]);
          });
        }
      });
    });
    return result;
  };

  const findValue = (key: string, messages: ColumnItem[], index: number) => {
    const findKey = messages.find((v: any) => v.title === key);
    return findKey ? findKey.data[index] : '';
  };

  const updateMessagesService = (): Array<Promise<MerchantMessages>> => {
    const diffMessages = getDiffMessagesOnly(updatedData);
    const dataLengMockArr = [];
    for (let i = 0; i < diffMessages[0].data.length; i += 1) {
      dataLengMockArr.push(i);
    }

    // Need to create as many payloads as the diffMessages.data length is like
    const updateMessagesPromises: Array<Promise<MerchantMessages>> = dataLengMockArr.map((notUsed, index) => {
      const payload: MerchantMessagesPayload = {
        category: findValue('Category', diffMessages, index),
        description: findValue('Description', diffMessages, index),
        gridId: Number(findValue('ID', diffMessages, index)), // same as ID
        id: Number(findValue('ID', diffMessages, index)),
        key: findValue('Key', diffMessages, index),
        locale: findValue('Locale', diffMessages, index),
        value: findValue('Displayed text', diffMessages, index),
      };

      const mid = Number(findValue('Merchant ID', diffMessages, 0));
      return updateMerchantMessages(mid, payload);
    });
    return updateMessagesPromises;
  };

  const updateMessages = async () => {
    setIsUpdatingNewData(true);
    setNewData(updatedData);
    setHasMadeChanges(false);

    const updateMessagesPromises = await updateMessagesService();
    const response = await Promise.all(updateMessagesPromises);
    const isResponseError = response.filter((v) => !v.success).length > 0;
    if (isResponseError) {
      setUpdateStatus(UpdateStatuses.FAILED);
    } else {
      setColumns(mergeTableData(updatedData, columns, setLatestMessagesData));
      setUpdateStatus(UpdateStatuses.SUCCESS);
    }
    setIsUpdatingNewData(false);
  };

  const tableBodyMemo = useMemo(() => {
    let storeLatestData: ColumnItem[] = [];
    const handleUpdate = (data: any) => {
      const compareData: ColumnItem[] = storeLatestData.length > 0 ? storeLatestData : newData;
      const latestData = cloneDeep(compareData).map((val, index) => {
        if (data.updatedRow[index]) {
          val.data[data.index] = data.updatedRow[index].data;
        }
        return val;
      });

      const isChanged: boolean = JSON.stringify(newData) !== JSON.stringify(latestData);
      setHasMadeChanges(isChanged);
      setUpdatedData(latestData);
      storeLatestData = latestData;
    };

    return (newData.length > 0 && newData[0]) && (
      <TableBodyContent
        columns={dataToDisplay(newData)}
        handleClick={(data: any) => console.log(data)}
        editable={editable}
        handleUpdate={handleUpdate}
      />
    );
  }, [editable, newData]);

  return (
    <Modal id="modal-component-container" open={open}>
      <Modal.Header>
        { pageTitle } | Merchant ID: { findValue('Merchant ID', allData, 0) }
        { updateStatus && (
          <span
            className="pl-2"
            style={{
              color: updateStatus === UpdateStatuses.SUCCESS ? '#21ba45' : '#db2828',
            }}
          >
            ({updateStatus === UpdateStatuses.SUCCESS ? 'Succesfully updated' : 'Could not update, server error'})
          </span>
        )}
      </Modal.Header>
      <Modal.Content>
        <Table celled inverted selectable>
          <Table.Header>
            <Table.Row>
              {
                (newData.length > 0 && newData[0]) && dataToDisplay(newData).map((column) =>
                  <Table.HeaderCell key={column.title}>{column.title}</Table.HeaderCell>)
              }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableBodyMemo}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Column floated="left" width={8}>
            <div style={{ textAlign: 'left' }}>
              <Popup
                content="This will open up a new modal where you select which messages to delete"
                trigger={(
                  // eslint-disable-next-line no-alert
                  <Button negative onClick={() => alert('Feature coming ...')}>
                    Remove translations
                  </Button>
              )}
              />
            </div>
          </Grid.Column>
          <Grid.Column floated="right" width={8}>
            <Button className="mr-2" color="black" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              disabled={!hasMadeChanges}
              content="Save"
              loading={isUpdatingNewData}
              labelPosition="right"
              icon="checkmark"
              onClick={updateMessages}
              positive
            />
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

const dataToRenderToModal = [
  'Key',
  'Category',
  'Locale',
  'Displayed text',
  'Description',
];

export default MessagesModal;
