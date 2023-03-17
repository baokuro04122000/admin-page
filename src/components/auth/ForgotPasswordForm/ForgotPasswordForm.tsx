import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store'
import { actionEmailResetPassword } from '../../../store/authentication/action'
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import {notificationController} from '../../../controllers/notificationController'
import { Alert } from 'antd';
import { LOGIN_PATH } from '../../../constants/routes';
import * as S from './ForgotPasswordForm.styles';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';
import { ErrorResponse } from '@app/api/openapi-generator';

interface ForgotPasswordFormData {
  email: string;
}

const initValues = {
  email: '',
};

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const [isLoading, setLoading] = useState(false);
  const [notify, setNotify] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const message = await dispatch(actionEmailResetPassword(values.email))
      setNotify(message)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      setError(error.errors.message)
    }
  }, [dispatch])

  const ShowDescription = () => {
    if(!notify && !error) return <S.Description>{t('forgotPassword.description')}</S.Description>
    return <></>
  }
  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.BackWrapper onClick={() => navigate(LOGIN_PATH)}>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <Auth.FormTitle>{t('common.resetPassword')}</Auth.FormTitle>
        <ShowDescription/>
        { notify ?
          <Alert message={notify} type="success" />
          : null
        }
        { error ?
          <Alert message={error} type="error" />
          : null
        }
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.emailError') },
            {type: 'email', message: t('common.notValidEmail') }
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')}  onChange={() => {
            if(notify) setNotify('')
            if(error) setError('')
          }}/>
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
