import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../../../common/inputs/Input/Input';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';

export const CitiesItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item
      name="city" 
      label={t('common.city')}
      rules={[{required: true, message:t('commom.requiredField')}]}
     >
      <Input />
    </BaseButtonsForm.Item>
  );
};
