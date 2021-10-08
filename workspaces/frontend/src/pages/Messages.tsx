import type { FC, SyntheticEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { RouteComponentProps } from 'react-router';
import { handleLegBoRoute } from 'utils/helpers';
import type {
  SetShowLegacy,
  ColumnItem,
  GenerateTableColumnsData,
} from 'types/global-types';
import type { MerchantMessagesPayload } from 'types/service/general-service-types';
import { Locales } from 'types/global-types';
import type { Pages } from 'types/route-types';
import { useAppSelector } from 'redux/hooks';
import { fetchMerchantMessages } from 'service/middleware';
import TableView from 'components/TableView';
import MessagesModal from 'components/MessagesModal';
import {
  Button,
  Modal,
  Header,
  Icon,
  Input,
} from 'semantic-ui-react';
import { addNewMerchantMessages } from 'service/general-apis/general-service';

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy;
  viewId: Pages;
}

let messages: Array<ColumnItem> = [];

const Messages: FC<Props> = ({ setShowLegacy, viewId }) => {
  const { merchantId } = useAppSelector(({ contextReducer }) => contextReducer);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [selectedMessageData, setSelectedMessageData] = useState([] as ColumnItem[]);
  const [customAction, setCustomAction] = useState(null as null|any);

  const handleClick = (columnData: any) => {
    const addAllMatchingKeys: ColumnItem[] = [];
    columnData.forEach((column: any) => {
      addAllMatchingKeys.push({
        title: column.title,
        data: [],
      });
    });

    // eslint-disable-next-line no-unused-expressions
    const originalKeysArr = messages.find((v: ColumnItem) =>
      v.title === 'Key');
    const clickedColumnKey = columnData.find((v: ColumnItem) =>
      v.title === 'Key');

    // eslint-disable-next-line no-unused-expressions
    originalKeysArr && originalKeysArr.data.forEach((key: any, keyIndex: number) => {
      if (key === clickedColumnKey.data) {
        addAllMatchingKeys.forEach((val, i) => {
          val.data.push(messages[i].data[keyIndex]);
        });
      }
    });

    // Want to add all matching keys
    setSelectedMessageData(addAllMatchingKeys);
    setShouldOpenModal(true);
  };

  const content = useMemo(() => {
    const getColumns: (
      startIndex: number,
      endIndex: undefined|number,
      searchInputValue?: string,
    ) => Promise<GenerateTableColumnsData> = async (
      startIndex,
      endIndex,
      searchInputValue,
    ) => {
      const merchantMessages = await fetchMerchantMessages(merchantId, startIndex, endIndex, searchInputValue);
      messages = merchantMessages.data;
      return merchantMessages as GenerateTableColumnsData;
    };

    return (
      <TableView
        title="Messages"
        getColumns={getColumns}
        handleClick={handleClick}
        customActionsDropdown={{
          name: 'Actions',
          onClick: (e: SyntheticEvent, data: any) => setCustomAction(data.value),
          options: customActionOptions,
          disabledBtn: () => false,
          isLoadingBtn: () => false,
        }}
      />
    );
  }, [merchantId]);

  // Conditionally render own content / update legacybackoffice path
  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !content);
  }, [content, setShowLegacy, viewId]);

  return (
    <>
      {selectedMessageData[0] && (
        <MessagesModal
          merchantId={merchantId}
          pageTitle={`
          Edit the "${Array.isArray(selectedMessageData[0].data)
            ? selectedMessageData[0].data[0]
            : selectedMessageData[0].data}" translation.
          `}
          allData={selectedMessageData}
          open={shouldOpenModal}
          setOpen={setShouldOpenModal}
          editable
          setLatestMessagesData={(newMesssages: ColumnItem[]) => { messages = newMesssages; }}
        />
      )}
      {content}
      {customAction && (
        <CustomActionModal
          customAction={customAction}
          setCustomAction={setCustomAction}
          merchantId={merchantId}
        />
      )}
    </>
  );
};

interface CustomActionModalProps {
  customAction: customActionOptionsValues,
  setCustomAction: (customAction: null) => void,
  merchantId: number,
}
const CustomActionModal:FC<CustomActionModalProps> = ({ customAction, setCustomAction, merchantId }) => {
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addTranslationInputFields, setAddTranslationInputFields] = useState({
    newMessageKey: '',
    newDescription: '',
    category: '',
  } as Record<string, string>);

  useEffect(() => {
    const hasEmptyFields = Object.values(addTranslationInputFields).some((v) => !v);
    if (hasEmptyFields) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [addTranslationInputFields]);

  const addTranslationContent = () => {
    const onChangeHandler = (value: string, type: string) => {
      setAddTranslationInputFields({
        ...addTranslationInputFields,
        [type]: value,
      });
    };

    return (
      <div id="message-edit-container">
        <div>
          <Input
            onChange={(e, data) => onChangeHandler(data.value, 'newMessageKey')}
            focus
            placeholder="New message key"
          />
        </div>
        <div>
          <Input
            onChange={(e, data) => onChangeHandler(data.value, 'newDescription')}
            placeholder="Description"
          />
        </div>
        <div>
          <Input
            onChange={(e, data) => onChangeHandler(data.value, 'category')}
            placeholder="Category"
          />
        </div>
      </div>
    );
  };

  const modalContent = () => {
    switch (customAction) {
      case customActionOptionsValues.NEW_TRANSLATION:
        return addTranslationContent();
      case customActionOptionsValues.EXPORT_KEYS:
      case customActionOptionsValues.IMPORT_KEYS:
      default:
        return <h2 style={{ textAlign: 'center' }}>Feature will come ...</h2>;
    }
  };

  const addNewTranslations = async () => {
    setIsLoading(true);
    const newMerchantMessagesPromises = Object.values(Locales).map((locale, index) => {
      const payload: Omit<MerchantMessagesPayload, 'id'> = {
        category: addTranslationInputFields.category,
        description: addTranslationInputFields.newDescription,
        gridId: `new_message_${addTranslationInputFields.newMessageKey}_${locale}${index}_1`, // same as ID
        key: addTranslationInputFields.newMessageKey,
        locale,
        value: '',
      };
      return addNewMerchantMessages(merchantId, payload);
    });
    await Promise.all(newMerchantMessagesPromises);
    setIsLoading(false);
    setCustomAction(null);
  };

  const handleClick = () => {
    switch (customAction) {
      case customActionOptionsValues.NEW_TRANSLATION:
        return addNewTranslations();
      case customActionOptionsValues.EXPORT_KEYS:
      case customActionOptionsValues.IMPORT_KEYS:
      default:
        return setCustomAction(null);
    }
  };

  return (
    <Modal
      basic
      open
      size="small"
    >
      <Header icon>
        <Icon name="edit" />
        {customAction}
      </Header>
      <Modal.Content>
        { modalContent() }
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={() => setCustomAction(null)}
        >
          <Icon name="remove" /> Close
        </Button>
        <Button
          disabled={!isBtnDisabled}
          color="green"
          inverted
          loading={isLoading}
          onClick={handleClick}
        >
          <Icon name="checkmark" /> Update
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

enum customActionOptionsValues {
  NEW_TRANSLATION = 'New translation',
  EXPORT_KEYS = 'Export keys',
  IMPORT_KEYS = 'Import keys',
}

const customActionOptions = [
  [
    {
      key: 'pencil alternate',
      icon: 'edit',
      text: customActionOptionsValues.NEW_TRANSLATION,
      value: customActionOptionsValues.NEW_TRANSLATION,
    },
  ],
  [
    {
      key: 'pencil alternate',
      icon: 'edit',
      text: customActionOptionsValues.EXPORT_KEYS,
      value: customActionOptionsValues.EXPORT_KEYS,
    },
    {
      key: 'delete',
      icon: 'delete',
      text: customActionOptionsValues.IMPORT_KEYS,
      value: customActionOptionsValues.IMPORT_KEYS,
    },
  ],
];

export default Messages;
