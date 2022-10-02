import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import { ReactComponent as GoogleIcon } from '../../../assets/icons/google.svg';
import { getGoogleOAuthURL } from '../../../utils'
import { useAppDispatch } from '../../../store'
import { actionGoogleLogin, actionLogin } from '../../../store/authentication/action'
import { notificationController } from '../../../controllers/notificationController'
import { 
  RESET_PASSWORD_PATH,
} from '../../../constants/routes'
import {register} from '../../../api/authentication'
import {AxiosError} from 'axios'
import * as S from './LoginForm.styles';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';

interface LoginFormData {
  email: string;
  password: string;
}

export const initValues: LoginFormData = {
  email: '',
  password: '',
};

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(actionGoogleLogin())
  }, [dispatch])

  const handleSubmit = useCallback(async (values: LoginFormData) => {
    setLoading(true);
    try {
      await dispatch(actionLogin(values.email, values.password))
      setLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.errors.message)
      setLoading(false)
      notificationController.error(
        {
          message: error.errors.message,
          duration: null
        })    
    }
  }, [dispatch])
  const testRegister= async () => {
    try {
      const {data} = await register({
        email:"baotrandinh100@gmail.com",
        password:"12345678a",
        name:"bao tran",
        gender:'male'
      })
      console.log(data)
    } catch (error) {
      const err = error as AxiosError
      console.log(err.response?.data)
    }
  }
  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.ActionsWrapper>
          <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </BaseForm.Item>
          <Link to={RESET_PASSWORD_PATH}>
            <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
          </Link>
        </Auth.ActionsWrapper>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
        <BaseForm.Item noStyle>
        <a href={getGoogleOAuthURL()}>
          <Auth.SocialButton type="default" htmlType="submit">
            <Auth.SocialIconWrapper>
              <GoogleIcon />
            </Auth.SocialIconWrapper>
            {t('login.googleLink')}
          </Auth.SocialButton>
        </a>
        <Auth.SocialButton type="default" onClick={testRegister}>
            <Auth.SocialIconWrapper>
              <GoogleIcon />
            </Auth.SocialIconWrapper>
            test register
          </Auth.SocialButton>
        </BaseForm.Item>
    </Auth.FormWrapper>
  );
};