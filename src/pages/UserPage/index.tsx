import { Button } from "../../components/common/buttons/Button/Button"
import { useAppDispatch } from "../../store"
import { actionLogout, actionRegisterSellerRequest } from '../../store/authentication/action'
import { notificationController } from "../../controllers/notificationController"
import axios from 'axios'
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
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return <>
    <span>This is an user page</span>
    <Button onClick={handleLogout}>Logout</Button>
    <Button onClick={handleRegisterSeller}>Register seller</Button>
    <Button onClick={handleTestCheckOut}>Paypal</Button>
    <Button onClick={handleTestCheckOut2}>Paypal 2</Button>

  </>
}
export default UserTest