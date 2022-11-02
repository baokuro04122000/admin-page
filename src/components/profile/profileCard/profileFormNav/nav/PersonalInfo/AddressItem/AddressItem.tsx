import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../../../common/inputs/Input/Input';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';

export const AddressItem: React.FC<{ number: number }> = ({ number }) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name={`address${number}`} label={`${t('common.address')} ${number}`}>
      <Input />
    </BaseButtonsForm.Item>
  );
};
