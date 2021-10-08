import type { Merchants, Merchant } from 'types/slices/metadata-types';
import type { GeneralMetaDataMerchant } from 'types/service/metadata';

const getMerchantChildrenNew = (merchants: GeneralMetaDataMerchant[], level: number): Merchant[] => {
  let merchantTree: Merchant[] = [];
  merchants.filter((merchant) => merchant.enabled).forEach((merchant) => {
    const hasChildren = merchant.children.length > 0;

    const merchantItem = createMenuItem({
      value: merchant.id,
      text: merchant.name,
      className: getMerchantMenuItemClass(level, hasChildren),
    });

    if (hasChildren) {
      const subLevel = level + 1;
      const merchantChildren = getMerchantChildrenNew(merchant.children, subLevel);
      merchantTree.push(merchantItem);
      merchantTree = [...merchantTree, ...merchantChildren];
    } else {
      merchantTree.push(merchantItem);
    }
  });
  return merchantTree;
};

const getMerchantMenuItemClass = (level: number, hasChildren: boolean): string => {
  let className = `parent-mid parent-mid-${level}`;
  if (hasChildren) {
    className = `${className} has-children-mid`;
  }
  return className;
};

interface CreateMenuItem {
  value: number;
  text: string;
  className?: string;
}
const createMenuItem = (props: CreateMenuItem): Merchant => {
  const { value, text, className } = props;
  return {
    key: value,
    value,
    text,
    className,
  };
};

export const parseMerchants = (merchantData: GeneralMetaDataMerchant): Merchants => {
  const startLevel = 0;
  return getMerchantChildrenNew([merchantData], startLevel);
};
