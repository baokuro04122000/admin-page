import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '../../../../../../common/forms/BaseButtonsForm/BaseButtonsForm';
import * as S from './BirthdayItem.styles';

interface Props {
  name: string;
  label?:string;
  format?:string;
}
export const BirthdayItem: React.FC<Props> = ({name, label, format}) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <S.BirthdayPicker format={format} />
    </BaseButtonsForm.Item>
  );
};
