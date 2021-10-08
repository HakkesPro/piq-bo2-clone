import type { FC } from 'react';
import styled from 'styled-components/macro';
import { Dropdown } from 'semantic-ui-react';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { contextActions } from 'redux/actions';
import { notifySelectNewMerchant } from 'utils/post-message';
import type { Merchants, Merchant } from 'types/slices/metadata-types';
import { setPaymentIqGeneralSettings } from 'utils/local-storage';
import '../utils/style/merchant-dropdown.scss';
import { pixelAmount } from 'vars';

const DesktopWrapper = styled(Dropdown)({
  width: '375px !important',
  maxHeight: pixelAmount.xxl,
});

const MobileWrapper = styled(Dropdown)({
  width: '75px !important',
});

interface Props {
  type?: 'mobile' | 'desktop';
}

const MerchantDropdown: FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();
  const merchantId: number = useAppSelector(
    ({ contextReducer }) => contextReducer.merchantId,
  );
  const merchants: Merchants = useAppSelector(
    ({ metadataReducer }) => metadataReducer.merchants,
  );

  const handleChangeMerchant = (e: Event, { value }: Merchant): void => {
    // we notify the legacy backoffice client so that it can trigger a mid change there as well
    notifySelectNewMerchant(value);
    // update the redux slice
    dispatch(contextActions.setMerchantId(value));

    // set the mid in localStorage PAYMENTIQ_GENERAL_SETTINGS so we can auto-populate the store on reload
    setPaymentIqGeneralSettings({ merchantId: value });
  };

  const dropdownProps = {
    className: 'merchant-dropdown-menu',
    placeholder: 'Select MerchantID',
    onChange: handleChangeMerchant,
    value: merchantId,
    selectOnBlur: false,
    selectOnNavigation: false,
    search: true,
    selection: true,
    options: merchants,
  };

  if (type === 'mobile') {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MobileWrapper {...dropdownProps} />;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DesktopWrapper {...dropdownProps} />;
};

export default MerchantDropdown;
