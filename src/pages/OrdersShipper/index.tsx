import React from 'react';
import { useTranslation } from 'react-i18next';
import {Tables} from '../../components/ordersShipper/OrdersShipper'
import { PageTitle } from '../../components/common/PageTitle/PageTitle';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('shipper.orders')}</PageTitle>
      <Tables />
    </>
  );
};

export default Orders;
