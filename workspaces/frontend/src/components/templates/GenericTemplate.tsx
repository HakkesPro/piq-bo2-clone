import type { FC, SyntheticEvent } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector } from 'redux/hooks';
import { Dropdown, Button, Header } from 'semantic-ui-react';
import { TemplateApi } from 'service';
import { TemplateTypes, TemplateApiTypes } from 'types/service/templates';
import type {
  TemplateResponse, CreateUpdateTemplateResponse, Template, SortedRecentTemplates,
} from 'types/service/templates';
import type { DropdownOption } from 'types/global-types';
import { Users } from 'types/global-types';
import Editor from 'components/text-editor/Editor';
import RecentTemplates from 'components/templates/RecentTemplates';
import NoTemplates from 'components/templates/NoTemplates';
import { VerticalSpacer } from 'components/help-components/Spacers';
import ViewLoader from 'components/ViewLoader';
import { EditorWrapper, EditorBackground } from 'elements/EditorElements';
import { mapTemplateOptions, getRecentTemplates, newTemplateFactory } from 'utils/templateUtils';
import { pixelAmount } from 'vars';

const Wrapper = styled.div({
  height: '100%;',
  display: 'flex',
  flexDirection: 'column',
});

const TopContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const DropdownWrapper = styled.div({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
});

interface GenericTemplateProps {
  templateApiType: TemplateApiTypes
  templateType: TemplateTypes
}

const defaultRecentTemplates = () => ({ allRecent: null, yourRecent: null, othersRecent: null });

const GenericTemplate:FC<GenericTemplateProps> = (props): JSX.Element => {
  const { merchantId, userName } = useAppSelector(({ contextReducer }) => contextReducer);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstEditorLoad, setFirstEditorLoad] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<Template>|null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState<boolean>(false);
  const [recentTemplates, setRecentTemplates] = useState<SortedRecentTemplates>(defaultRecentTemplates());
  const [sortByUser, setSortByUser] = useState<string>(userName);

  const reset = () => {
    setFirstEditorLoad(false);
    setTemplates(null);
    setRecentTemplates(defaultRecentTemplates);
    setSelectedTemplate(null);
    setIsNewTemplate(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (!isLoading) {
      reset(); // reset view when chaning mid
      const fetchData = async () => {
        const response: TemplateResponse = await TemplateApi.fetchTemplates({
          merchantId,
          type: props.templateApiType,
        });

        if (isMounted) {
          setTemplates(response.result);
        }
      };

      fetchData();

      // to deal with component being unmounted while still performing the async request
      return () => { isMounted = false; };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId, userName, isLoading]);

  // trigger new filtering on recently edited when changing filter by user
  useEffect(() => {
    if (templates) {
      const { allRecent, yourRecent, othersRecent }: SortedRecentTemplates = getRecentTemplates(
        templates,
        userName,
      );

      setRecentTemplates({
        ...recentTemplates,
        allRecent,
        yourRecent,
        othersRecent,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByUser, templates]);

  const handleSelectTemplateId = (value: number) => {
    if (templates) {
      const template: Template|undefined = templates.find((tmplt) => tmplt.id === value);
      if (template) {
        handleSelectTemplate(template);
      }
    }
  };

  const handleSelectTemplate = (template: Partial<Template>) => {
    setSelectedTemplate(null);
    setIsNewTemplate(false);
    setTimeout(() => {
      setSelectedTemplate(template);
    }, 50);
    if (!isFirstEditorLoad) {
      setFirstEditorLoad(true);
    }
  };

  const handleSortByUserSelect = (option: DropdownOption) => {
    if (option.value === userName) {
      setSortByUser(userName);
    } else if (option.value === Users.ALL) {
      setSortByUser(Users.ALL);
    } else if (option.value === Users.OTHERS) {
      setSortByUser(Users.OTHERS);
    }
  };

  const handleNewTemplate = () => {
    handleSelectTemplate(newTemplateFactory(props.templateType, props.templateApiType));
    setIsNewTemplate(true);
  };

  const handleSaveTemplate = async (templateData: Partial<Template>, newTemplate: boolean) => {
    setIsLoading(true);
    templateData = { ...selectedTemplate, ...templateData };
    let response: null | CreateUpdateTemplateResponse = null;
    if (newTemplate) {
      response = await TemplateApi.createTemplate({ merchantId, payload: templateData });
    } else {
      response = await TemplateApi.updateTemplate({ merchantId, payload: templateData });
    }

    setIsLoading(false);

    // A nextTick (event loop) paus. Without this recently saved template won't be selected
    // FetchTemplate is triggerd by when updating isLoading to false. At the start of fetchTemplates
    // We reset everything (selectedTemplate included).
    // This timeout lets the reset be done first, then we select the template
    setTimeout(() => {
      if (response) {
        setSelectedTemplate(response.result);
      }
    }, 0);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    setIsLoading(true);
    const response = await TemplateApi.deleteTemplate({ merchantId, templateId });
    if (response.success) {
      setIsLoading(false);
    } else {
      // handle error
    }
  };

  const getTemplateBody = (template: Partial<Template>): string|undefined => {
    switch (props.templateType) {
      // email templates use the same editor type (html) as HTML
      case TemplateTypes.EMAIL:
      case TemplateTypes.HTML:
        if (props.templateApiType === TemplateApiTypes.EMAIL) {
          return template?.values?.htmlBody || template?.values?.body;
        }
        return template?.values?.body;

      default:
        return template?.values?.body;
    }
  };

  if (isLoading) {
    return <ViewLoader />;
  } if (templates) {
    const templateOptions: DropdownOption[] = mapTemplateOptions(templates);

    return (
      <Wrapper>
        <TopContainer>
          { !isNewTemplate && templates.length === 0 ? (
            <NoTemplates templateApiType={props.templateApiType} onNewTemplate={handleNewTemplate} />
          ) : (
            <>
              <DropdownWrapper>
                <Header as="h5">Select template</Header>
                <Dropdown
                  onChange={(e: SyntheticEvent, option: any) => handleSelectTemplateId(option.value)}
                  placeholder="Select a template to edit"
                  noResultsMessage="No templates found"
                  className="template-dropdown-menu"
                  selectOnNavigation={false}
                  selectOnBlur={false}
                  value={selectedTemplate?.id}
                  search
                  selection
                  fluid
                  options={templateOptions}
                />
              </DropdownWrapper>

              <Button
                style={{ height: pixelAmount.xl4, alignSelf: 'flex-end' }}
                onClick={handleNewTemplate}
                secondary
                content="New template"
                icon="plus"
              />
            </>
          )}

        </TopContainer>

        <VerticalSpacer factor={2} />

        <RecentTemplates
          selectedTemplate={selectedTemplate}
          allRecent={recentTemplates.allRecent}
          yourRecent={recentTemplates.yourRecent}
          othersRecent={recentTemplates.othersRecent}
          userName={userName}
          sortByUser={sortByUser}
          handleSelectTemplate={handleSelectTemplate}
          onSort={handleSortByUserSelect}
        />

        <EditorWrapper>
          { selectedTemplate && (
          <Editor
            template={selectedTemplate}
            apiType={props.templateApiType}
            handleSave={handleSaveTemplate}
            handleDelete={handleDeleteTemplate}
            value={getTemplateBody(selectedTemplate)}
            language={props.templateType}
            newTemplate={isNewTemplate}
          />
          )}
          { isFirstEditorLoad && (
          /*
            When changing template to edit, the editor will be reloaded, causing a flicker
            This puts a dark background behind the editor so no flicker can be seen. Purely cosmetic
          */
          <EditorBackground offsetHeight={selectedTemplate?.values?.subject ? '56px' : '0px'} />
          )}
        </EditorWrapper>
      </Wrapper>
    );
  }
  return <></>;
};

export default GenericTemplate;
