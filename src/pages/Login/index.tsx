import React from 'react';
import { useTranslation } from 'react-i18next';
import {GoogleOAuthProvider} from '@react-oauth/google'
import { LoginForm } from '../../components/auth/LoginForm/LoginForm';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.login')}</PageTitle>
      <GoogleOAuthProvider clientId='782585478907-b8t4h88cdv4bu0kh0t2uq5d2ahr0dlgi.apps.googleusercontent.com'>
        <LoginForm />
      </GoogleOAuthProvider>
    </>
  );
};

export default LoginPage;
