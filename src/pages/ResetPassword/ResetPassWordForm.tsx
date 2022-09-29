import * as Yup from "yup";
import {useCallback, useState} from "react";
import {useAppDispatch} from "../../store";
import {Formik, FormikHelpers} from "formik";

import styles from "../Login/login.module.css";
import {Alert, Button, Col, Image, Row} from "antd";
import {Form, Input, SubmitButton} from "formik-antd";
import {Link, useLocation} from "react-router-dom";
import {LOGIN_PATH, RESET_PASSWORD_PATH} from "../../constants/routes";
import Swal from "sweetalert2";


const initialValues = {
    password: "",
    confirmPassword:"",
    jt:''
};

const validationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required")
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')

});


type FormValues = typeof initialValues;

type FieldErrors = {
    Field: string,
    Message: string
}
const ResetPassWordForm= () =>{
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false)
    const dispatch = useAppDispatch();
    // const history = useHistory()
    const {search} = useLocation();
    const jt = search.substring(4)
    console.log(search.substring(4))
    const handleSubmit = useCallback(
        async (values: FormValues, action: FormikHelpers<FormValues>) => {
            console.log('Iam here')
            
        },
        [dispatch]
    );

    const handleShowPassword = (): void => {
        setShowPass((pre)=>{
            return !pre
        })
    }
    return (
        <div className={styles.wrapper}>
            {/*<h1>Reset Account Password</h1>*/}
        <div className={styles["form-wrapper"]}><h1 style={{ textAlign: "center" }} className={styles["title-form"]}>Reset Account Password</h1>
            <div style={{ margin: "4px 0" }}>

                {/* {error && <Alert message={error} type="error" />} */}
            </div>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {() => (

                    <Form layout="vertical"
                        //  onChange={() => setError("")}
                    >
                        <Form.Item name="password" label={<span style={{fontWeight:"bold"}}>New Password</span>} >
                            <Input
                                placeholder="Enter new password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                suffix={
                                    <Image
                                        onClick={handleShowPassword}
                                        width={29}
                                        height={29}
                                        preview={false}
                                        style={{cursor:"pointer"}}
                                        src="https://s3-alpha-sig.figma.com/img/3109/7092/9e08d183218f23a238e25cfdf57f9203?Expires=1662940800&Signature=FXP2lBujcKjgHzFZQT~Gh15H7UBla6gH~MxPIkDiJHPXv1dwPPqYh2e-dd4e-Or0rB-7l~BfkTDCrmgKU5DUJbk~rswrJvDSqwiHXTmcCPJxwWWBp4n9TmmgYvesXY1wdjWwUfpVugEPMGKy6x0pFB0X~wqaFV5atxCLsMMG06sGk6dZu8Z7-N8p9SfRCuYYFJ~jzuDc6m5IJZLDn~78uOFnRKGAnvTZPmJ6OIi309Erf-bLb4f8wIOrPRtneFk~d9KXcpXPHM53roqQG9xJCt3sj2ul~uHrYyAnY-3zEFemuVdVwjJB0HD9UsNrG6Dv2xcUMmJVRyQdbjxOCy7hqQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                                    />
                                }
                                prefix={<span />}
                            />

                        </Form.Item>
                        <Form.Item name="confirmPassword" label={<span style={{fontWeight:"bold"}}>Confirm New Password</span>}>
                            <Input
                                placeholder="Confirm new password"
                                name="confirmPassword"
                                type={showPass ? "text" : "password"}
                                suffix={<span/>
                                    
                                }
                                prefix={<span />}
                            />
                        </Form.Item>
                        <Alert
                            banner={false}
                            message={<span className={styles["custom-alert-error"]}>{error && error}</span>}
                            className={styles["custom-alert-style"]}
                        />
                        <Row style={{
                            justifyContent:"center",
                            alignItems:"center",
                            padding: "19px 0px 14px 0px"
                        }}>
                            <Col span={8}>
                                <SubmitButton
                                    className={styles["submit-btn"]}
                                    size="large"
                                >
                                    Submit
                                    {/* <Link to={LOGIN_PATH} style={{textDecoration:"none"}}>Submit</Link> */}
                                </SubmitButton>
                            </Col>
                            {/*<Col span={12} offset={4} style={{textAlign: "right"}}>*/}
                            {/*    <Button type="link" htmlType="button" className={styles["custom-link-style"]} onClick={()=>{console.log("click forget")}}>*/}
                            {/*        <Link to={RESET_PASSWORD_PATH} style={{textDecoration:"underline"}}>Forgotten password?</Link>*/}
                            {/*    </Button>*/}
                            {/*</Col>*/}
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
        </div>
    );
};

export default ResetPassWordForm