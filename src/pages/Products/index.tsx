import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tables } from '../../components/products/Products';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';

const Products: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('product.products')}</PageTitle>
      <Tables />
    </>
  );
};

export default Products;
