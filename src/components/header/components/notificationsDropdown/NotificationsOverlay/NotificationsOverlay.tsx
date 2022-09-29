import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '@app/components/Notification/Notification';
import { capitalize } from '@app/utils/utils';

import { notificationsSeverities } from '@app/constants/notificationsSeverities';
import * as S from './NotificationsOverlay.styles';

interface NotificationsOverlayProps {
  notifications: NotificationType[];
  setNotifications: (state: NotificationType[]) => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  ...props
}) => {
  const { t } = useTranslation();


  return (
    <S.NoticesOverlayMenu mode="inline" {...props}>
      <S.MenuRow gutter={[20, 20]}>
        <Col span={24}>
          {notifications.length > 0 ? (
            <Space direction="vertical" size={10} split={<S.SplitDivider />}>
              <></>             
            </Space>
          ) : (
            <S.Text>{t('header.notifications.noNotifications')}</S.Text>
          )}
        </Col>
        <Col span={24}>
          <Row gutter={[10, 10]}>
            {notifications.length > 0 && (
              <Col span={24}>
                <S.Btn type="ghost" onClick={() => setNotifications([])}>
                  {t('header.notifications.readAll')}
                </S.Btn>
              </Col>
            )}
            <Col span={24}>
              <S.Btn type="link">
                <Link to="/">{t('header.notifications.viewAll')}</Link>
              </S.Btn>
            </Col>
          </Row>
        </Col>
      </S.MenuRow>
    </S.NoticesOverlayMenu>
  );
};
