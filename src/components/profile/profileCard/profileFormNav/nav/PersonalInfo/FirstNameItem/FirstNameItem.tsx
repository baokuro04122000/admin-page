import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../../../common/inputs/Input/Input';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';

export const FirstNameItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="firstName" label={t('common.firstName')}>
      <Input />
    </BaseButtonsForm.Item>
  );
};
