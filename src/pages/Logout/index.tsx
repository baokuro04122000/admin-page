import {useEffect} from 'react'
import { useAppDispatch } from '../../store'
import { actionLogout } from '../../store/authentication/action'
const Logout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(actionLogout())
  },[dispatch])

  return <div>This is a logout page</div>
}
export default Logout