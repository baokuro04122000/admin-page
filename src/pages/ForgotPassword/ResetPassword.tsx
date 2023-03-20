import { useState, useMemo, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store'
import { setNotifyResetPassowrd } from '../../store/authentication/slice'
import { notificationController } from '../../controllers/notificationController'
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm/ForgotPasswordForm'
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
        }
    }, [notify, dispatch])
    
}

const ResetPassword = () => {
    const [isForgot, setIsForgot] = useState(true)
    const [isNewPassword, setIsNewPassword] = useState(false)
    useNotifycation()
    return (
        <>
          
            <NewPasswordForm  />
        </>
    )
}
export default ResetPassword