import React, { useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Dropdown } from '../../../common/Dropdown/Dropdown';
import { Button } from '../../../common/buttons/Button/Button';
import { Badge } from '../../../Badge/Badge';

import { notifications as fetchedNotifications, Notification } from '../../../../api/notifications.api';
import { HeaderActionWrapper } from '../../Header.styles';

export const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(fetchedNotifications);
  const [isOpened, setOpened] = useState(false);

  return (
    <Dropdown
      trigger={['click']}
      overlay={<></>}
      onVisibleChange={setOpened}
    >
      <HeaderActionWrapper>
        <Button
          type={isOpened ? 'ghost' : 'text'}
          icon={
            <Badge dot>
              <BellOutlined />
            </Badge>
          }
        />
      </HeaderActionWrapper>
    </Dropdown>
  );
};
