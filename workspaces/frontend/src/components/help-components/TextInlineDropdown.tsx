import type { FC, SyntheticEvent } from 'react';
import { Dropdown } from 'semantic-ui-react';
import type { DropdownOption } from 'types/global-types';
import { pixelAmount } from 'vars';

interface Props {
  label: string,
  value?: string,
  autoSelectFirst?: boolean,
  options: DropdownOption[],
  display?: 'block'|'inline',
  style?: Record<string, string|number>,
  handleSelect: (option: DropdownOption) => void
}

export const TextInlineDropdown: FC<Props> = ({
  label,
  handleSelect,
  autoSelectFirst = true,
  value,
  options,
  display = 'block',
  style = {},
}) => {
  const Wrapper = (display === 'block' ? 'div' : 'span') as keyof JSX.IntrinsicElements;

  let wrapperStyle = { ...style };
  if (display === 'block') {
    wrapperStyle = {
      ...style,
      marginBottom: pixelAmount.md,
    };
  }

  const getDefaultValue = () => {
    if (value) {
      return options.find((option) => option.value === value)?.value;
    } if (autoSelectFirst) {
      return options[0].value;
    }
    return false;
  };

  return (
    <Wrapper style={wrapperStyle}>
      {label} {' '}
      <Dropdown
        inline
        options={options}
        defaultValue={getDefaultValue()}
        onChange={(e: SyntheticEvent, option: any) => handleSelect(option)}
      />
    </Wrapper>
  );
};

export default TextInlineDropdown;
