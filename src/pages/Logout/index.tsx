import {useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { actionLogout } from '../../store/authentication/action'
const Logout = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(({authentication}) => authentication.authUser?.data)
  useEffect(() => {
    dispatch(actionLogout({
      accessToken: auth?.accessToken as string,
      refreshToken: auth?.refreshToken as string
    }))
  },[dispatch])

  return <div>This is a logout page</div>
}
export default Logout