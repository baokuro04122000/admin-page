import React from 'react';
import { NightTimePicker } from './NightTimePicker/NightTimePicker';
import { Switch } from '../../../../../Switch/Switch';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';


export const NightModeSettings: React.FC = () => {
  const { t } = useTranslation();

 

  return (
    <>
      <SwitchContainer>
        <span>{t('common.auto')}</span>
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={true}  />
      </SwitchContainer>
      
    </>
  );
};

export const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
