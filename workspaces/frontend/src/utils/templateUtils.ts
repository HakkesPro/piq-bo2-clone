import type { DropdownOption } from 'types/global-types';
import type { Template, SortedRecentTemplates } from 'types/service/templates';
import { TemplateTypes, TemplateApiTypes } from 'types/service/templates';

export const mapTemplateOptions = (templates: Template[]): DropdownOption[] =>
  templates.map((template) => ({
    key: `${template.name}_${template.id}`,
    text: template.name,
    value: template.id,
  }));

/* Filter templates based on updatedBy and take those filtered by the current user
   Then return the 5 latest (or all if fewer)
*/

export const getRecentTemplates = (
  templates: Template[],
  userName: string,
  numberOfTemplates = 5,
): SortedRecentTemplates => {
  const yourTemplates: Template[] = templates.filter((template) => template.updatedBy === userName);
  const othersTemplates: Template[] = templates.filter(
    (template) => template.updatedBy !== userName,
  );

  const sortLogic = (a: string, b: string) => {
    // if the updated property is null it means it has never been updated
    // only created. So that ones i propbably first
    if (a === null) {
      return -1;
    }
    const bIsBiggerThanA = () => (b > a ? 1 : 0);
    return b < a ? -1 : bIsBiggerThanA();
  };

  const allRecentTemplates = templates.sort((a, b) =>
    sortLogic(a.updated, b.updated));
  const yourRecentTemplates = yourTemplates.sort((a, b) =>
    sortLogic(a.updated, b.updated));
  const othersRecentTemplates = othersTemplates.sort((a, b) =>
    sortLogic(a.updated, b.updated));

  return {
    allRecent: allRecentTemplates.slice(0, numberOfTemplates),
    yourRecent: yourRecentTemplates.slice(0, numberOfTemplates),
    othersRecent: othersRecentTemplates.slice(0, numberOfTemplates),
  };
};

const getNewDefaultTemplate = (
  type: TemplateTypes,
  apiType: TemplateApiTypes,
): string => {
  switch (type) {
    // email templates use the same editor type (html) as HTML
    case TemplateTypes.EMAIL:
    case TemplateTypes.HTML:
    default:
      if (apiType === TemplateApiTypes.EMAIL) {
        return defaultTemplates.emailTemplate;
      }
      return defaultTemplates.htmlTemplate;

    case TemplateTypes.SCRIPT:
      return defaultTemplates.scriptTemplate;
    case TemplateTypes.SQL:
      return defaultTemplates.sqlTemplate;
    case TemplateTypes.MQ:
      return defaultTemplates.mqTemplate;
    case TemplateTypes.CSS:
      return defaultTemplates.cssTemplate;
  }
};

export const newTemplateFactory = (
  templateType: TemplateTypes,
  templateApiType: TemplateApiTypes,
): Partial<Template> => ({
  channel: '',
  locale: '',
  name: '',
  type: templateApiType,
  values: {
    url: '',
    body: getNewDefaultTemplate(templateType, templateApiType),
  },
  version: 1,
});

export const defaultTemplateSubject = (
  templateSubject?: string,
): string | null => {
  if (templateSubject && templateSubject !== '') {
    return templateSubject;
  }
  return null;
};

const emailTemplate = `<html>
  <head></head>

  <body>
    <h2>Hi and welcome to the forest moon of Endor</h2>
  </body>
</html>`;

const scriptTemplate = `function deathStar (target) {
  if (target === 'Alderaan') {
    return 'fire'
  } else {
    return 'hold fire'
  }
}`;

const htmlTemplate = `<html>
  <head></head>

  <body>
    <h2>These are not the droids you're looking for</h2>
  </body>
</html>`;

const sqlTemplate = 'select * from wookies where name = "Chewbacca"';

const mqTemplate = `{
   "name": "Han Solo"
}`;

const cssTemplate = `.millenium-falcon {
  color: blue;
}`;

export const defaultTemplates = {
  emailTemplate,
  scriptTemplate,
  htmlTemplate,
  mqTemplate,
  sqlTemplate,
  cssTemplate,
};
