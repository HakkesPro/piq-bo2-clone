import type { FC, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Input, Select,
} from 'semantic-ui-react';
import type { DropdownOption } from 'types/global-types';
import { Locales } from 'types/global-types';
import type { Template, TemplateMetaData, TemplateDataValiation } from 'types/service/templates';

interface BasicModalProps {
  template: Partial<Template>,
  newTemplate: boolean,
  open: boolean,
  setModal: (open: boolean) => void,
  handleSave: (templateData: TemplateMetaData) => void
}
const SaveTemplateModal: FC<BasicModalProps> = ({
  template,
  newTemplate,
  open,
  setModal,
  handleSave,
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<TemplateDataValiation>({ name: true, url: true });
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(true);
  const [templateMetaData, setTemplateMetaData] = useState<TemplateMetaData>(
    {
      name: template.name || '',
      channel: template.channel || '',
      url: template.values?.url || '',
      locale: template.locale || Locales.ENGLISH,
    },
  );

  useEffect(() => {
    if (isDirty) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateMetaData]);

  const validateForm = () => {
    const { name, url } = templateMetaData;

    const isNameDefined = name !== '';
    const isValidUrl = validUrl(url);

    setIsValid({
      name: isNameDefined,
      url: isValidUrl,
    });

    const isFormValid = !isNameDefined || !isValidUrl;
    setIsFormInvalid(!isFormValid);
  };

  const validUrl = (url: string) => {
    if (url === '') {
      return true;
    }
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
  };

  const handleFormInputChange = (e: SyntheticEvent, fieldName: string) => {
    if (!isDirty) {
      setIsDirty(true);
    }

    const target = e.target as HTMLInputElement;
    setTemplateMetaData({
      ...templateMetaData,
      [fieldName]: target.value,
    });
  };

  const handleFormDropdownChange = (option: any, fieldName: string) => {
    setTemplateMetaData({
      ...templateMetaData,
      [fieldName]: option.value,
    });
  };

  const localeOptions = (): DropdownOption[] => Object.keys(Locales).map((locale) => (
    {
      key: locale,
      text: Locales[locale as keyof typeof Locales],
      value: Locales[locale as keyof typeof Locales],
    }
  ));

  return (
    <Modal onClose={() => setModal(false)} onOpen={() => setModal(true)} open={open}>
      <Modal.Header>
        {newTemplate ? 'Save new template' : 'Update template'}
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-template-name"
              value={templateMetaData.name}
              onChange={(e: SyntheticEvent) => handleFormInputChange(e, 'name')}
              control={Input}
              error={!isValid.name}
              label="Template name"
              placeholder="Give the template a name"
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-template-channel"
              value={templateMetaData.channel}
              onChange={(e: SyntheticEvent) => handleFormInputChange(e, 'channel')}
              control={Input}
              label="Channel"
              placeholder="Template channel"
            />
            <Form.Field
              id="form-input-control-template-url"
              value={templateMetaData.url}
              onChange={(e: SyntheticEvent) => handleFormInputChange(e, 'url')}
              control={Input}
              error={!isValid.url}
              label="Url"
              placeholder="Template url"
            />
            <Form.Field
              control={Select}
              value={templateMetaData.locale}
              onChange={(e: SyntheticEvent, option: any) => handleFormDropdownChange(option, 'locale')}
              options={localeOptions()}
              content={templateMetaData.locale}
              label={{ children: 'Locale', htmlFor: 'form-select-template-locale' }}
              placeholder="Locale"
              search
              searchInput={{ id: 'form-select-template-locale' }}
            />
          </Form.Group>
        </Form>

      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setModal(false)}>
          Cancel
        </Button>
        <Button
          content={newTemplate ? 'Save new template' : 'Update template'}
          labelPosition="right"
          icon="checkmark"
          onClick={() => handleSave(templateMetaData)}
          disabled={!isFormInvalid}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SaveTemplateModal;
