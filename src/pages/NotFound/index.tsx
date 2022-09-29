import { SELLER_DASHBOARD_PATH } from "../../constants/routes";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate(SELLER_DASHBOARD_PATH)}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFound;
