import React from 'react';
import { Input } from '../../../../../../common/inputs/Input/Input';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';

export const LastNameItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="lastName" label={t('common.lastName')}>
      <Input />
    </BaseButtonsForm.Item>
  );
};
