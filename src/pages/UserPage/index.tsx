import { Button } from "../../components/common/buttons/Button/Button"
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
        duration: 5
      })
    }
  }

  const handleRegisterSeller =async () => {
    try {
      const data = await dispatch(actionRegisterSellerRequest())
      notificationController.success({
        message:data,
        duration: 3
      })
    } catch (error: any) {
      notificationController.error({
        message:error ? error.errors.message : "NETWORK ERROR",
        duration: 5
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