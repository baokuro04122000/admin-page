import React from 'react';
import { useTranslation } from 'react-i18next';
import {Tables} from 'components/dashboard/Dashboard'
import { PageTitle } from '../../components/common/PageTitle/PageTitle';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('order.orderss')}</PageTitle>
      <Tables />
    </>
  );
};

export default Dashboard;
