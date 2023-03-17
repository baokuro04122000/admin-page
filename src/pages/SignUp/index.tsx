import { PageTitle } from "../../components/common/PageTitle/PageTitle"
import { useTranslation } from "react-i18next";
import { SignUpForm } from "../../components/auth/SignUpForm/SignUpForm"

const SignUp = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.signUp')}</PageTitle>
      <SignUpForm />
    </>
  )
}
export default SignUp