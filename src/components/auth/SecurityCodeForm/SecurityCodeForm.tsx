import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { actionOTPResetPassword } from '../../../store/authentication/action'
import { notificationController } from '../../../controllers/notificationController'
import { Image, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import { VerificationCodeInput } from '../../../components/common/VerificationCodeInput/VerificationCodeInput';
import VerifyEmailImage from '../../../assets/images/verify-email.webp';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';
import * as S from './SecurityCodeForm.styles';

interface SecurityCodeFormProps {
  onForgot:(toggle: boolean) => void;
  onSecurityCode: (toggle: boolean) => void;
  onNewPassword: (toggle: boolean) => void;
}

export const SecurityCodeForm: React.FC<SecurityCodeFormProps> = ({ onForgot, onNewPassword , onSecurityCode }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  
  const [securityCode, setSecurityCode] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (securityCode.length === 6) {
      setLoading(true);
      handleFinish()
    }
  }, [securityCode]);

  const handleFinish = useCallback(async () => {
    try {
      await dispatch(actionOTPResetPassword(Number(securityCode)))
      onSecurityCode(false)
      onNewPassword(true)
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      notificationController.error({
        message:error.errors.message,
        duration: null
      })
    }
  }, [securityCode])

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" requiredMark="optional">
        <Auth.BackWrapper onClick={
          () => {
            onSecurityCode(false)
            onForgot(true)
          }
        }>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <S.ContentWrapper>
          <S.ImageWrapper>
            <Image src={VerifyEmailImage} alt="Not found" preview={false} />
          </S.ImageWrapper>
          <Auth.FormTitle>{t('securityCodeForm.title')}</Auth.FormTitle>
          <S.VerifyEmailDescription>{t('common.verifCodeSent')}</S.VerifyEmailDescription>
          {isLoading ? <Spin /> : <VerificationCodeInput autoFocus onChange={setSecurityCode} />}
          <Link to="/" target="_blank">
            <S.NoCodeText>{t('securityCodeForm.noCode')}</S.NoCodeText>
          </Link>
        </S.ContentWrapper>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
