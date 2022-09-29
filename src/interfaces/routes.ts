interface SingleRoute {
  path: string;
  element: JSX.Element;
  guard?: JSX.Element;
  permissions?: string[];
}
export interface RouteConfig extends SingleRoute {
  children?: SingleRoute[];
}
