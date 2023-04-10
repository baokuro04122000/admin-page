import React from 'react'
import {EditableTable} from './EditTable'
import { PageTitle } from 'components/common/PageTitle/PageTitle'
import { Btn } from 'components/common/MoonSunSwitch/MoonSunSwitch.styles'
import { Col, Row } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useResponsive } from 'hooks/useResponsive'
const ManageCategory = () => {
  const { isTablet: isTabletOrHigher, mobileOnly } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const isTitleShown = isTabletOrHigher || (mobileOnly && location.pathname === '/add-product');
  return (
    <>
      <PageTitle>Manage category</PageTitle>
      {!isTitleShown && (
        <Btn icon={<LeftOutlined />} type="text" onClick={() => navigate('/admin/users')}>
          Back
        </Btn>
      )}

      <Row gutter={[30, 30]}>
        <Col xs={24} md={24} xl={24}>
          <EditableTable/>
        </Col>
      
      </Row>
    </>
  )
}

export default ManageCategory
