import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store'
import { actionEmailResetPassword } from '../../../store/authentication/action'
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import {notificationController} from '../../../controllers/notificationController'
import * as S from './ForgotPasswordForm.styles';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';

interface ForgotPasswordFormData {
  email: string;
}

const initValues = {
  email: '',
};
interface Props {
  onForgot:(toggle: boolean) => void,
  onSecurityCode: (toggle: boolean) => void,
  onNewPassword?: (toggle: boolean) => void
}
export const ForgotPasswordForm: React.FC<Props> = ({onForgot, onNewPassword, onSecurityCode}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await dispatch(actionEmailResetPassword(values.email))
      onForgot(false)
      onSecurityCode(true)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      console.log(error)
      notificationController.error({
        message: error.errors.message,
        duration: null
      })
    }
  }, [dispatch])

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.BackWrapper onClick={() => navigate(-1)}>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <Auth.FormTitle>{t('common.resetPassword')}</Auth.FormTitle>
        <S.Description>{t('forgotPassword.description')}</S.Description>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[{ required: true, message: t('common.emailError') }]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <BaseForm.Item noStyle>
          <S.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('forgotPassword.sendInstructions')}
          </S.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};