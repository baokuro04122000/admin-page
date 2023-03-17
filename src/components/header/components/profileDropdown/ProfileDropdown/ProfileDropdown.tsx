import React from 'react';
import { Avatar, Col, Row } from 'antd';
import { Dropdown } from '../../../../common/Dropdown/Dropdown';
import { H6 } from '../../../../../components/typography/H6/H6';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '../../../../../store'
import { useResponsive } from '../../../../../hooks/useResponsive';
import * as S from './ProfileDropdown.styles';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();

  const user = useAppSelector(({authentication}) => authentication?.authUser?.data)

  return user ? (
    <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
      <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
        <Col>
          <Avatar src={(user?.typeLogin === "local") ? user?.seller?.logo?.fileLink : user.avatar} alt="seller" shape="circle" size={40} />
        </Col>
        {isTablet && (
          <Col>
            <H6>{user.name}</H6>
          </Col>
        )}
      </S.ProfileDropdownHeader>
    </Dropdown>
  ) : null;
};
