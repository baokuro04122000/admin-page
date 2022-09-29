import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import { initValues as loginInitVal } from '../../../components/auth/LoginForm/LoginForm';
import { useResponsive } from '../../../hooks/useResponsive';
import { Dates } from '../../../constants/Dates';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';
import * as S from './LockForm.styles';

interface LockFormData {
  password: string;
}

const initValues = {
  password: loginInitVal.password,
};

export const LockForm: React.FC = () => {
  const navigate = useNavigate();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  

  const currentDateInUTC = dateState.toUTCString();
  const currentTime = Dates.format(currentDateInUTC, 'h:mm A');
  const currentDate = Dates.format(currentDateInUTC, 'dddd, MMMM D, YYYY');

  useEffect(() => {
    const interval = setInterval(() => setDateState(new Date()), 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = ({ password }: LockFormData) => {
    setLoading(true);
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <S.ContentWrapper>
          <S.Time>{currentTime}</S.Time>
          <S.Date>{currentDate}</S.Date>
          <S.AvatarCircle>
            <Avatar src={'#'} alt="user avatar" size={mobileOnly ? 59 : 77} />
          </S.AvatarCircle>
          <S.Name>hello</S.Name>
        </S.ContentWrapper>
        <S.FormItem
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </S.FormItem>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
