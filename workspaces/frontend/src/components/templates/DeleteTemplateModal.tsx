import type { FC } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import type { Template } from 'types/service/templates';

interface DeleteTemplateModalProps {
  template: Partial<Template>,
  open: boolean,
  setModal: (open: boolean) => void,
  handleDelete: (templateId: number) => void
}
const DeleteTemplateModal: FC<DeleteTemplateModalProps> = ({
  open,
  template,
  setModal,
  handleDelete,
}) => {
  const callTemplateDelete = () => {
    if (template.id) {
      handleDelete(template.id);
    }
  };

  return (
    <Modal onClose={() => setModal(false)} open={open}>
      <Modal.Header>Delete template</Modal.Header>
      <Modal.Content>
        Are you sure you want to delete <b>{ template.name }</b>?
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setModal(false)}>
          Cancel
        </Button>
        <Button
          content="Delete template"
          labelPosition="right"
          icon="delete"
          onClick={callTemplateDelete}
          negative
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteTemplateModal;
