import React, { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LOGIN_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser } from "../store/authentication/selector";
const Unauthorized = React.lazy(()=> import('../pages/Unauthorized')) 
interface Props {
  children?: ReactElement;
}

const AuthRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isUser = useAppSelector(selectIsUser)
  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  if (isUser) return < Unauthorized />
  return <Outlet />;
};

export default AuthRoute;
