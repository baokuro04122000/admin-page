import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BaseForm } from "../../../components/common/forms/BaseForm/BaseForm";
import ImgCrop from "antd-img-crop";
import { Upload } from "../../../components/Upload/Upload";
import { Col, Row, UploadFile } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import * as Auth from "../../../layout/AuthLayout/AuthLayout.styles";
import * as S from "./SignUpForm.styles";
import { notificationController } from "../../../controllers/notificationController";
import { FacebookIcon } from "../../../components/common/icons/FacebookIcon";
import { LinkedinIcon } from "../../../components/common/icons/LinkedinIcon";
import { Button } from "../../../components/common/buttons/Button/Button";
import { UploadOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../store";
import { LOGIN_PATH } from "../../../constants/routes";
import {
  actionSellerRegister,
  actionSignUpUser,
  saveFile,
} from "../../../store/authentication/action";

import { SellerRegisterRequest } from "@app/api/openapi-generator";
import { PropsUpload, useUploadLogo } from "../../../hooks/useUpload";
import { RcFile, UploadChangeParam, UploadProps } from "antd/lib/upload";
import axios, { AxiosError } from "axios";
import { Select } from "components/common/selects/Select/Select";
import { DatePicker } from "components/common/pickers/DatePicker";

const initValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  logo: "",
  gender: "",
  birthdate: "",
};

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();

  const { handleUploadLogoProps, logoLoading, logo } = useUploadLogo({
    t,
    name: "logo",
  });

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {

    const date = new Date(values.birthdate.$d);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    const year = date.getFullYear().toString();
    const dateStr = `${month}/${day}/${year}`;
    console.log("check::", values);
    const user: any = {
      name: values.name,
      email: values.email,
      password: values.password,
      avatar: logo.replace("temp", "images"),
      gender: values.gender,
      birthDay: dateStr
    };

    try {
      await actionSignUpUser(user);
      window.location.href = process.env.REACT_APP_BOOK_ECOMMERCE_HOST + '/auth/login'
    } catch (error: any) {
      console.log(error);
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
        duration: 5,
      });
    }
  };

  return (
    <Auth.FormWrapper>
      <BaseForm
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        initialValues={initValues}
      >
        <Row gutter={{ xs: 10, md: 15, xl: 30 }}>
          <Col xs={24} md={24}>
            <S.Title>Sign Up</S.Title>
          </Col>

          <Col xs={24} md={12}>
            <Auth.FormItem
              name="name"
              label="Name"
              rules={[{ required: true, message: t("common.requiredField") }]}
            >
              <Auth.FormInput placeholder="Name" />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={12}>
            <Auth.FormItem
              name="email"
              label="Email"
              rules={[{ required: true, message: t("common.requiredField") }]}
            >
              <Auth.FormInput placeholder="Email" />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={24}>
            <Auth.FormItem
              label={t("common.password")}
              name="password"
              rules={[{ required: true, message: t("common.requiredField") }]}
            >
              <Auth.FormInputPassword placeholder={t("common.password")} />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={24}>
            <Auth.FormItem
              name="confirmPassword"
              label={t("common.confirmPassword")}
              dependencies={["password"]}
              rules={[
                { required: true, message: t("common.requiredField") },
                ({ getFieldValue }) => {
                  return {
                    validator(_, value) {
                      if (value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(t("common.confirmPasswordError"))
                        );
                      }
                    },
                  };
                },
              ]}
            >
              <Auth.FormInputPassword placeholder="Confirm Password" />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={16}>
            <Auth.FormItem
              label="Gender"
              name="gender"
              rules={[{ required: true, message: t("common.requiredField") }]}
            >
              <Select
                defaultValue=""
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={8}>
            <Auth.FormItem label={t("seller.logo")} name="logo">
              <ImgCrop rotate={true}>
                <Upload {...handleUploadLogoProps}>
                  <Button
                    type="default"
                    icon={
                      logoLoading ? <LoadingOutlined /> : <UploadOutlined />
                    }
                  >
                    {t("seller.upload")}
                  </Button>
                </Upload>
              </ImgCrop>
            </Auth.FormItem>
          </Col>

          <Col xs={24} md={24}>
            <Auth.FormItem
              label="Birth Date"
              name="birthdate"
              rules={[{ required: true, message: t("common.requiredField") }]}
            >
              <DatePicker format={"MM/DD/YYYY"} />
            </Auth.FormItem>
          </Col>
          <Col xs={24} md={24}>
            <Auth.ActionsWrapper>
              <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
                <Auth.FormCheckbox>
                  <Auth.Text>
                    {t("signup.agree")}{" "}
                    <Link to="/" target={"_blank"}>
                      <Auth.LinkText>{t("signup.termOfUse")}</Auth.LinkText>
                    </Link>{" "}
                    and{" "}
                    <Link to="/" target={"_blank"}>
                      <Auth.LinkText>
                        {t("signup.privacyOPolicy")}
                      </Auth.LinkText>
                    </Link>
                  </Auth.Text>
                </Auth.FormCheckbox>
              </BaseForm.Item>
            </Auth.ActionsWrapper>
          </Col>
          <Col xs={24} md={24}>
            <BaseForm.Item noStyle>
              <Auth.SubmitButton
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                {t("common.signUp")}
              </Auth.SubmitButton>
            </BaseForm.Item>
          </Col>
          <Col xs={24} md={24}>
            <Auth.FooterWrapper>
              <Auth.Text>
                {t("signup.alreadyHaveAccount")}{" "}
                <Link to={process.env.REACT_APP_BOOK_ECOMMERCE_HOST + '/auth/login'}>
                  <Auth.LinkText>{t("common.here")}</Auth.LinkText>
                </Link>
              </Auth.Text>
            </Auth.FooterWrapper>
          </Col>
        </Row>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
