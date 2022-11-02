import React from 'react';
import { Space } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '../../common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select, Option } from '../../common/selects/Select/Select';
import { bookLanguages } from '../../../constants/languages';

const languageOptions = bookLanguages.map((lang) => (
  <Option key={lang.id} value={lang.name}>
    <Space align="center">
      <ReactCountryFlag svg countryCode={lang.countryCode} alt="country flag" />
      {lang.title}
    </Space>
  </Option>
));

export const LanguageItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="language" label={t('product.language')}>
      <Select
        placeholder={t('product.placeholderLanguage')}
      >{languageOptions}</Select>
    </BaseButtonsForm.Item>
  );
};
