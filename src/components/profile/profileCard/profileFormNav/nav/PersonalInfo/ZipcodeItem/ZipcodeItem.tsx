import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../../../common/inputs/Input/Input';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';

export const ZipcodeItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="zipcode" label={t('common.zipcode')}>
      <Input />
    </BaseButtonsForm.Item>
  );
};
