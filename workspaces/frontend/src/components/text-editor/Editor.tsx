import type { FC, SyntheticEvent } from 'react';
import { useState, useRef } from 'react';
import { Button, Input } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import Editor from '@monaco-editor/react';
import { VerticalSpacer } from 'components/help-components/Spacers';
import SaveTemplateModal from 'components/templates/SaveTemplateModal';
import DeleteTemplateModal from 'components/templates/DeleteTemplateModal';
import { TemplateApiTypes } from 'types/service/templates';
import type { TemplateMetaData, TemplateTypes, Template } from 'types/service/templates';
import { defaultTemplateSubject } from 'utils/templateUtils';
import { pixelAmount } from 'vars';

const EditorWrapper = styled.div({
  height: '100%',
  width: '100%;',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

const EmailSubject = styled.div({
  fontWeight: 'normal',
  display: 'flex',
  flexDirection: 'row',
});

const EmailSubjectHeader = styled.p({
  margin: `0px ${pixelAmount.md} 0px 0px`,
  fontWeight: 'bold',
  alignSelf: 'center',
});

const EmailSubjectInput = styled(Input)({
  flexGrow: 1,
});

const ButtonsWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  position: 'absolute',
  bottom: '0px',
});

interface Props {
  value?: string,
  apiType: TemplateApiTypes,
  language: TemplateTypes,
  template: Partial<Template>
  newTemplate: boolean
  handleSave: (templateData: Partial<Template>, newTemplate: boolean) => void
  handleDelete: (templateId: number) => void
}

const PaymentIQEditor: FC<Props> = ({
  value,
  apiType,
  language,
  template,
  newTemplate,
  handleSave,
  handleDelete,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [
    subjectValue,
    setSubjectValue,
  ] = useState<string|null>(defaultTemplateSubject(template?.values?.subject));
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };
  const handleEditorSave = () => {
    if (newTemplate) {
      // show template where the user can specify the name, channel, url and locale
      setIsSaveModalOpen(true);
    } else {
      // otherwise just save it right away
      const payload: Partial<Template> = {
        ...template,
        values: {
          ...template.values,
          // @ts-ignore:next-line
          body: editorRef.current ? editorRef.current.getValue() : '', // test cases doesn't handle refs
        },
      };

      if (subjectValue && payload.values) {
        payload.values.subject = subjectValue;
      }

      handleSave(payload, newTemplate);
    }
  };

  const generateTemplatePayload = (templateMetaData: TemplateMetaData): Partial<Template> => ({
    name: templateMetaData.name,
    channel: templateMetaData.channel,
    locale: templateMetaData.locale,
    values: {
      url: templateMetaData.url,
      // @ts-ignore:next-line
      body: editorRef.current.getValue(),
    },
  });

  const handleMetaDataSave = (templateMetaData: TemplateMetaData) => {
    const templateData: Partial<Template> = generateTemplatePayload(templateMetaData);
    if (subjectValue && templateData.values) {
      templateData.values.subject = subjectValue;
    }
    handleSave(templateData, newTemplate);
  };

  const handleTemplateEdit = () => {
    setIsSaveModalOpen(true);
  };

  const handleTemplateDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleTemplateDelete = () => {
    if (template.id) {
      handleDelete(template.id);
    }
  };

  const handleUpdateSubject = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSubjectValue(target.value);
  };

  // When in the process of adding a new template - we don't have a template id
  const allowTemplateDelete = (): boolean => template.id === undefined;
  const shouldDisplayEmailSubject = apiType === TemplateApiTypes.EMAIL;
  return (
    <EditorWrapper>

      { shouldDisplayEmailSubject && (
        <>
          <EmailSubject>
            <EmailSubjectHeader style={{ fontWeight: 'bold' }}>
              Subject:
            </EmailSubjectHeader>
            <EmailSubjectInput onChange={handleUpdateSubject} placeholder="No subject" value={subjectValue} />
          </EmailSubject>

          <VerticalSpacer factor={2} />
        </>
      )}

      { value && (
        <Editor
          theme="vs-dark"
          height={`calc(100% - ${shouldDisplayEmailSubject ? pixelAmount.xl11 : pixelAmount.xl5})`}
          width="100%"
          onMount={handleEditorDidMount}
          defaultLanguage={language}
          defaultValue={value}
        />
      )}

      <ButtonsWrapper>
        <Button
          onClick={handleTemplateDeleteModal}
          disabled={allowTemplateDelete()}
          content="Delete"
        />

        { template.id && (
        <Button
          onClick={handleTemplateEdit}
          disabled={allowTemplateDelete()}
          icon="edit"
          content="Edit details"
        />
        )}

        <Button
          onClick={handleEditorSave}
          content="Save"
          labelPosition="left"
          primary
          icon="save"
        />
      </ButtonsWrapper>
      <VerticalSpacer factor={2} />

      <SaveTemplateModal
        open={isSaveModalOpen}
        newTemplate={newTemplate}
        template={template}
        handleSave={handleMetaDataSave}
        setModal={(open: boolean) => setIsSaveModalOpen(open)}
      />

      <DeleteTemplateModal
        open={isDeleteModalOpen}
        template={template}
        handleDelete={handleTemplateDelete}
        setModal={(open: boolean) => setIsDeleteModalOpen(open)}
      />

    </EditorWrapper>
  );
};

export default PaymentIQEditor;
