import { Button } from "../../components/buttons/Button/Button"
import { useAppDispatch } from "../../store"
import { actionLogout, actionRegisterSellerRequest } from '../../store/authentication/action'
import { notificationController } from "../../controllers/notificationController"
const UserTest = () => {
  const dispatch = useAppDispatch()
  const handleLogout =async () => {
    try {
      await dispatch(actionLogout())
    } catch (error: any) {
      notificationController.error({
        message:error ? error.errors.message : "NETWORK ERROR",
        duration: null
      })
    }
  }

  const handleRegisterSeller =async () => {
    try {
      const data = await dispatch(actionRegisterSellerRequest())
      notificationController.success({
        message:data,
        duration: null
      })
    } catch (error: any) {
      notificationController.error({
        message:error ? error.errors.message : "NETWORK ERROR",
        duration: null
      })      
    }
  }
  return <>
    <span>This is an user page</span>
    <Button onClick={handleLogout}>Logout</Button>
    <Button onClick={handleRegisterSeller}>Register seller</Button>
  </>
}
export default UserTest