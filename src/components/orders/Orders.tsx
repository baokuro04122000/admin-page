import React from 'react';
import {BasicTable} from './BasicTable/BasicTable';
import { useTranslation } from 'react-i18next';
import * as S from './Orders.styles';

export const Tables: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={'Order Done Table'} padding="1.25rem 1.25rem 0">
          <BasicTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
