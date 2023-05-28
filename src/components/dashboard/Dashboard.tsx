import React from 'react';
import {BasicTable} from './BasicTable/BasicTable';
import { useTranslation } from 'react-i18next';
import * as S from './Dashboard.styles';
import { useAppSelector } from '../../store';

export const Tables: React.FC = () => {
  const { t } = useTranslation();
  const orders = useAppSelector(({product}) => product.ordersDone)
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={`Dashboard - Total Order: ${orders?.total} - Total Earn: $${orders?.totalEarn}`} padding="1.25rem 1.25rem 0">
          <BasicTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
