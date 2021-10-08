import type { FC } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import type {
  Template,
  SortedRecentTemplates,
} from 'types/service/templates';
import type { DropdownOption } from 'types/global-types';
import { Users } from 'types/global-types';
import TextDropdownInline from 'components/help-components/TextInlineDropdown';
import { pixelAmount } from 'vars';

const RecentContainer = styled.div({
  marginBottom: pixelAmount.lg,
});

interface RecentTemplatesProps extends SortedRecentTemplates {
  userName: string,
  sortByUser: string | Users.ALL | Users.OTHERS,
  onSort: (option: DropdownOption) => void,
  handleSelectTemplate: (template: Template) => void,
  selectedTemplate: Partial<Template>|null
}

const RecentTemplates:FC<RecentTemplatesProps> = ({
  allRecent,
  yourRecent,
  othersRecent,
  userName,
  sortByUser,
  selectedTemplate,
  onSort,
  handleSelectTemplate,
}): JSX.Element|null => {
  if (!allRecent || allRecent.length === 0) {
    return null;
  }

  const isYourRecentEmpty: boolean = !yourRecent || yourRecent.length === 0;
  const isOthersRecentEmpty: boolean = !othersRecent || othersRecent.length === 0;
  let activeRecentList: Template[]|null = null;
  if (sortByUser === userName && !isYourRecentEmpty) {
    activeRecentList = yourRecent;
  } else if (sortByUser === Users.OTHERS) {
    activeRecentList = othersRecent;
  } else {
    activeRecentList = allRecent;
  }

  if (!activeRecentList) {
    return null;
  }

  const editedByOptions: DropdownOption[] = [
    { key: '2', text: 'anyone', value: Users.ALL },
  ];
  if (isOthersRecentEmpty) {
    editedByOptions.unshift(
      {
        key: '1', text: 'others (no recent)', value: Users.OTHERS, disabled: true,
      },
    );
  } else {
    editedByOptions.unshift(
      { key: '1', text: 'others', value: Users.OTHERS },
    );
  }
  if (isYourRecentEmpty) {
    editedByOptions.unshift(
      {
        key: '0', text: 'you (no recent)', value: userName, disabled: true,
      },
    );
  } else {
    editedByOptions.unshift(
      { key: '0', text: 'you', value: userName },
    );
  }

  return (
    <RecentContainer>
      <TextDropdownInline
        style={{ display: 'block' }}
        label="Recently edited by"
        value={isYourRecentEmpty ? Users.ALL : userName}
        options={editedByOptions}
        handleSelect={onSort}
      />

      { activeRecentList.map((template) => (
        <Label
          key={`${template.id}_${template.id}`}
          style={{ marginBottom: pixelAmount.md }}
          as="a"
          color={template.id === selectedTemplate?.id ? 'orange' : 'grey'}
          onClick={() => handleSelectTemplate(template)}
          horizontal
        >
          { template.name }
        </Label>
      ))}
    </RecentContainer>
  );
};

export default RecentTemplates;
