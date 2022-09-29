import styles from "./ResetPassword.module.css";

import SendEmailForm from "./SendEmailForm";
import ResetPassWordForm from "./ResetPassWordForm";

const Index =()=>{
    return (
        <div>
            <div className={styles.wrapper}>
                <SendEmailForm/>

            </div>
            {/*<div><ResetPassWordForm/></div>*/}
        </div>


    )

}
export default Index