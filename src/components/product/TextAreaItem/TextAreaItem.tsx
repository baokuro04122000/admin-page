import React from 'react';
import { BaseButtonsForm } from '../../common/forms/BaseButtonsForm/BaseButtonsForm';
import { TextArea } from '../../common/inputs/Input/Input';
import { Rule } from 'antd/lib/form';

interface Props {
  name:string;
  label?:string;
  rows?:number;
  rules?:Rule[]
}

export const TextAreaItem: React.FC<Props> = ({name, label, rows=4, rules}) => {
  

  return (
    <BaseButtonsForm.Item 
      name={name} 
      label={label}
      rules={rules}
    >
      <TextArea 
        rows={rows}
      />
    </BaseButtonsForm.Item>
  );
};
