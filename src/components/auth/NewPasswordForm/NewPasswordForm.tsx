import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionNewPassword } from '../../../store/authentication/action';
import { notificationController } from '../../../controllers/notificationController'
import { LOGIN_PATH } from '../../../constants/routes'
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import { setUserId, setVerifyToken } from '../../../store/authentication/slice'
import * as S from './NewPasswordForm.styles';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';

interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

const initStates = {
  password: '',
  confirmPassword: '',
};

interface Props {
  onForgot:(toggle: boolean) => void;
  onNewPassword:(toggle: boolean) => void;
}

export const NewPasswordForm: React.FC<Props> = ({onForgot, onNewPassword}) => {
  const verifyCode = useAppSelector(({authentication}) => authentication.verifyToken)
  const userId = useAppSelector(({authentication}) => authentication.userId)
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (values: NewPasswordFormData) => {
    setLoading(true);
    try {
      if(verifyCode){
        await dispatch(actionNewPassword({userId, token: verifyCode, password: values.password}))
        dispatch(setVerifyToken(undefined))
        dispatch(setUserId(undefined))
        setLoading(false)
        navigate(LOGIN_PATH)
      }
    } catch (error: any) {
      console.log(error)
      setLoading(false)
      notificationController.error({
        message:error.errors.message,
        duration:5
      })
    }
  },[verifyCode]);

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initStates}>
        <Auth.BackWrapper onClick={() => {
          onForgot(true)
          onNewPassword(false)
        }
        }>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <Auth.FormTitle>{t('newPassword.title')}</Auth.FormTitle>
        <S.Description>{t('newPassword.description')}</S.Description>
        <Auth.FormItem
          name="password"
          label={t('common.password')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
              message: t('common.passwordInValid'),
            }
          ]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="confirmPassword"
          label={t('common.confirmPassword')}
          dependencies={['password']}
          rules={[
            { required: true, message: t('common.requiredField') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('common.confirmPasswordError')));
              },
            }),
          ]}
          hasFeedback
        >
          <Auth.FormInputPassword placeholder={t('common.confirmPassword')} />
        </Auth.FormItem>
        <BaseForm.Item noStyle>
          <S.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.resetPassword')}
          </S.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
