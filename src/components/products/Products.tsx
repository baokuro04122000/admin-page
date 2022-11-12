import React from 'react';
import { EditableTable } from './editableTableTest/EditableTable';
import { useTranslation } from 'react-i18next';
import * as S from './Products.styles';

export const Tables: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={t('product.productTable')} padding="1.25rem 1.25rem 0">
          <EditableTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
