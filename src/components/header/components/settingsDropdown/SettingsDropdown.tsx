import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown } from '../../../common/Dropdown/Dropdown';
import { Button } from '../../../common/buttons/Button/Button';
import { HeaderActionWrapper } from '../../Header.styles';
import { SettingsOverlay } from './settingsOverlay/SettingsOverlay/SettingsOverlay';

export const SettingsDropdown: React.FC = () => {
  const [isOpened, setOpened] = useState(false);

  return (
    <Dropdown overlay={<SettingsOverlay />} trigger={['click']} onVisibleChange={setOpened}>
      <HeaderActionWrapper>
        <Button type={isOpened ? 'ghost' : 'text'} icon={<SettingOutlined />} />
      </HeaderActionWrapper>
    </Dropdown>
  );
};
