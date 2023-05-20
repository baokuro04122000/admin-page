import { PageTitle } from "../../components/common/PageTitle/PageTitle"
import { useTranslation } from "react-i18next";
import { SignUpForm } from "../../components/auth/UserSignUpForm/SignUpForm"

const UserSignUp = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.signUp')}</PageTitle>
      <SignUpForm />
    
    </>
  )
}

export default UserSignUp;