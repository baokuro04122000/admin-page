import { useState, useMemo, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store'
import { setNotifyResetPassowrd, setVerifyToken } from '../../store/authentication/slice'
import { notificationController } from '../../controllers/notificationController'
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm/ForgotPasswordForm'
import { SecurityCodeForm } from '../../components/auth/SecurityCodeForm/SecurityCodeForm'
import { NewPasswordForm } from '../../components/auth/NewPasswordForm/NewPasswordForm'

const useNotifycation = () => {
    const dispatch = useAppDispatch()
    const notify = useAppSelector(({authentication}) => authentication.notifyResetPassowrd)
    useEffect(() => {
        if(notify){
            notificationController.success({
                message: notify,
                duration:5
            })
            return
        }
        dispatch(setNotifyResetPassowrd(undefined))
        return () => {
            dispatch(setNotifyResetPassowrd(undefined))
            dispatch(setVerifyToken(undefined))
        }
    }, [notify, dispatch])
    
}

const ResetPassword = () => {
    const [isForgot, setIsForgot] = useState(true)
    const [isSecurityCode, setIsSecurityCode] = useState(false)
    const [isNewPassword, setIsNewPassword] = useState(false)
    useNotifycation()
    return (
        <>
            {isForgot && <ForgotPasswordForm onForgot={setIsForgot} onSecurityCode={setIsSecurityCode} onNewPassword={setIsNewPassword} />}
            {isSecurityCode && <SecurityCodeForm onForgot={setIsForgot} onSecurityCode={setIsSecurityCode} onNewPassword={setIsNewPassword}/>}
            {isNewPassword && <NewPasswordForm onForgot={setIsForgot} onNewPassword={setIsNewPassword} />}
        </>
    )
}
export default ResetPassword