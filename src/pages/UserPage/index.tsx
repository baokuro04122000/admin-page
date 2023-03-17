import { Button } from "../../components/common/buttons/Button/Button"
import { useAppDispatch } from "../../store"
import { actionLogout, actionRegisterSellerRequest } from '../../store/authentication/action'
import { notificationController } from "../../controllers/notificationController"
import { useSocket } from '../../hooks/useSocket'
import { useAppSelector } from '../../store'
import { setSocket } from '../../store/authentication/slice'
import { useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
const UserTest = () => {
  const dispatch = useAppDispatch()
  const auth  = useAppSelector(({authentication}) => authentication.authUser)
  //const socket = useAppSelector(({authentication}) => authentication.socket)
  
  
  useEffect(() => {
    const socket = io('https://external-server-v1.onrender.com', {
    extraHeaders:{
      token: `Bearer ${auth?.data.accessToken}`
    }
  })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    socket.on('noti-confirm-order-success', (data: any) => {
      console.log(data)
    })
    socket.on('send-noti-confirm-order', (data: any) => {
      console.log(data)
    })
    socket.on('test', (data: any) =>{
      console.log(data)
    })
    socket.on('send-noti-confirm-shipping', (data: any) => {
      console.log(data)
    })
  },[])

  const handleLogout =async () => {
    try {
      await dispatch(actionLogout({
        accessToken: auth?.data.accessToken as string,
        refreshToken: auth?.data.refreshToken as string
      }))
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
  const handleTestCheckOut = async () => {
    try {
      const {data} =await axios.post('http://localhost:4000/v1/order/add', {
        "order":{
          "addressId":"6375524768aa5eb26f10d44e",
          "paymentType": "paypal",
          "items":[
            {
              "productId":"635ae09ff56b4562b23011d3",
              "quantity":2,
              "shippingCode": 1
            },
            {
              "productId":"635bfc10416afefa9e841113",
              "quantity":5,
              "shippingCode":1
            },
            {
              "productId":"635bfc48416afefa9e841118",
              "quantity":5,
              "shippingCode":1
            }
          ]
      
        }
      },{
        headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzcyNzhmMDgwODc3ZjJlMzhkYmZlMTYiLCJuaWNrTmFtZSI6IiIsImZpcnN0TmFtZSI6IkJhbyIsImxhc3ROYW1lIjoiVHJhbiIsInJvbGUiOiJ1c2VyIiwibWV0YSI6eyJ0b3RhbEJ1eSI6MCwidG90YWxDYW5jZWwiOjB9LCJzcGVjaWFsIjpbXSwidHlwZUxvZ2luIjoibG9jYWwiLCJpYXQiOjE2Njg0NDY1NTgsImV4cCI6MTY3MTAzODU1OH0.PGmOOyQV_D7P7F6BBOve4Sxz5rVDvI_zB5bDS3HV-uc"
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const handleTestCheckOut2 = async () => {
    try {
      const {data} =await axios.post('http://localhost:4000/v1/pay/paypal-create', {
        "paymentType":"paypal"
      },{
        headers:{
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzcyNzhmMDgwODc3ZjJlMzhkYmZlMTYiLCJuaWNrTmFtZSI6IiIsImZpcnN0TmFtZSI6IkJhbyIsImxhc3ROYW1lIjoiVHJhbiIsInJvbGUiOiJ1c2VyIiwibWV0YSI6eyJ0b3RhbEJ1eSI6MCwidG90YWxDYW5jZWwiOjB9LCJzcGVjaWFsIjpbXSwidHlwZUxvZ2luIjoibG9jYWwiLCJpYXQiOjE2Njg0NDY1NTgsImV4cCI6MTY3MTAzODU1OH0.PGmOOyQV_D7P7F6BBOve4Sxz5rVDvI_zB5bDS3HV-uc"
        },
        withCredentials: true
      })
      window.open(data.link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.log(error)
    }
  }
  const handleTestSocket = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const socket = useSocket('ws://localhost:4000', {
      extraHeaders:{
        token: `Bearer ${auth?.data.accessToken}`
      }
    })
    socket.on('noti-confirm-order-success', (data: any) => {
      console.log(data)
    })
    socket.on('send-noti-confirm-order', (data: any) => {
      console.log(data)
    })
    socket.on('test', (data: any) =>{
      console.log(data)
    })
    await dispatch(setSocket(socket))
  }
  
  return <>
    <span>This is an user page</span>
    <Button onClick={handleLogout}>Logout</Button>
    <Button onClick={handleRegisterSeller}>Register seller</Button>
    <Button onClick={handleTestCheckOut}>Paypal</Button>
    <Button onClick={handleTestCheckOut2}>Paypal 2</Button>
    <Button onClick={handleTestSocket}>Test Socket</Button>
    
  </>
}
export default UserTest