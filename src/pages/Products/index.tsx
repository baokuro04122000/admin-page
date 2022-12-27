import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tables } from '../../components/products/Products';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';
import { useAppSelector } from '../../store'
const Products: React.FC = () => {
  const { t } = useTranslation();
  // const {socket} = useAppSelector(({authentication}) => authentication.socket)
  // console.log('socket:::', socket.id)
  return (
    <>
      <PageTitle>{t('product.products')}</PageTitle>
      <Tables />
    </>
  );
};

export default Products;
