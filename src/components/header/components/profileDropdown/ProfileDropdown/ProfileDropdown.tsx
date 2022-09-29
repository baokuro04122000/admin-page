import React from 'react';
import { Avatar, Col, Row } from 'antd';
import { Dropdown } from '../../../../../components/Dropdown/Dropdown';
import { H6 } from '../../../../../components/typography/H6/H6';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';

import { useResponsive } from '../../../../../hooks/useResponsive';
import * as S from './ProfileDropdown.styles';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();

  const user = true

  return user ? (
    <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
      <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
        <Col>
          <Avatar src={"#"} alt="User" shape="circle" size={40} />
        </Col>
        {isTablet && (
          <Col>
            <H6>{`John Tom`}</H6>
          </Col>
        )}
      </S.ProfileDropdownHeader>
    </Dropdown>
  ) : null;
};
