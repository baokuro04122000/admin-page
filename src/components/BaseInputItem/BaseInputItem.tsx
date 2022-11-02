import React from 'react';
import { Input } from '../common/inputs/Input/Input';
import { BaseButtonsForm } from '../common/forms/BaseButtonsForm/BaseButtonsForm';
import { Rule } from 'antd/lib/form';

interface Props {
  name:string;
  label?:string;
  type:string;
  placeHolder?:string;
  rules?:Rule[];
}

export const BaseInputItem: React.FC<Props> = ({name, label, type, placeHolder, rules}) => {

  return (
    <BaseButtonsForm.Item
      name={name}
      label={label}
      rules={rules}
    >
      <Input
        name={name}
        type={type}
        placeholder={placeHolder}
      />
    </BaseButtonsForm.Item>
  );
};
