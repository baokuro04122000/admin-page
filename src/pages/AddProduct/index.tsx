import React, { useEffect } from 'react';
import { Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/buttons/Button/Button';

import { useResponsive } from '../../hooks/useResponsive';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';
import { ProductInfo } from '../../components/shop/ProductInfo/ProductInfo'
import { ProductForm } from '../../components/shop/ProductForm/ProductForm';
const AddProductLayout: React.FC = () => {
 

  const { t } = useTranslation();
  const { isTablet: isTabletOrHigher, mobileOnly } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  const isTitleShown = isTabletOrHigher || (mobileOnly && location.pathname === '/add-product');
  const isMenuShown = isTabletOrHigher || (mobileOnly && location.pathname !== '/add-product');

  return (
    <>
      <PageTitle>{t('product.addProduct')}</PageTitle>
      {!isTitleShown && (
        <Btn icon={<LeftOutlined />} type="text" onClick={() => navigate('/products')}>
          {t('common.back')}
        </Btn>
      )}

      <Row gutter={[30, 30]}>
        
        <Col xs={24} md={24} xl={24}>
          <ProductForm/>
        </Col>
      
      </Row>
    </>
  );
};

const ProfileCard = styled(Card)`
  height: unset;
`;

const Btn = styled(Button)`
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  padding: 0;
  height: unset;
  color: var(--secondary-color);
`;

export default AddProductLayout;
