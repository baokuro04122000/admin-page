import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import ImgCrop from 'antd-img-crop'
import { Upload } from '../../../components/Upload/Upload'
import { Col, Row, UploadFile } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';
import * as S from './SignUpForm.styles';
import {notificationController} from '../../../controllers/notificationController'
import { FacebookIcon } from '../../../components/common/icons/FacebookIcon';
import { LinkedinIcon } from '../../../components/common/icons/LinkedinIcon';
import { Button } from '../../../components/common/buttons/Button/Button';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../store'
import { LOGIN_PATH } from '../../../constants/routes'
import { 
  actionCheckSellerRegister,
  actionSellerRegister,
  saveFile
} from '../../../store/authentication/action'

import { SellerRegisterRequest } from '@app/api/openapi-generator';
import { PropsUpload, useUploadLogo } from '../../../hooks/useUpload';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import axios, { AxiosError } from 'axios';
interface SignUpFormData {
  shopName: string;
  shopPhone: string;
  slogan: string;
  fbLink?: string;
  inLink?:string;
  termOfUse: boolean;
  address:string;
}

const initValues = {
  shopName: '',
  shopPhone: '',
  slogan: '',
  fbLink: '',
  inLink: '',
  termOfUse: true,
};

export const useUploadProof = ({t, token, login=false}: PropsUpload) => {
  const [proofLoading, setProofLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteList, setDeleteList] = useState<string[]>([])
  
  const handleBeforeUpload = (file:RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg', 'file/dox', 'file/pdf']
    setProofLoading(true)
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:5
      })
      setProofLoading(false)
      return false
    }
    const limitFile = file.size / 1024 /1024 < 5
    if(!limitFile){
      setProofLoading(false)
      notificationController.error({
        message:t('seller.proofFileLimitSize'),
        duration:5
      })
      return false
    }
    return true
  }

  const handleUpload =async ({file, onError, onSuccess}: any) => {
    const formData = new FormData();
    formData.append('proof', file)
    try {
      const { data } = await axios.post(
        `${process.env.SERVER_UPLOAD ? process.env.SERVER_UPLOAD : "http://localhost:9000"}/api/upload/proof?login=${login}`,
        formData, {
        headers: {
          'Authorization': `${decodeURIComponent(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileList(pre => [...pre, {...data, name: file.name }])
    } catch (error: any) {
      setProofLoading(false)
      notificationController.error({
        message: error.response.data ? error.response.data.error.message : 'NETWORK ERROR',
        duration: 5
      })
    }
  }

  const handleOnChange = (file: UploadChangeParam) => {
    console.log('file proof:::', file)
    if(file.file.status === 'error'){
      notificationController.error({
        message:file.file.response ? file.file.response.error.message : "NETWORK ERROR",
        duration:5
      })
      return
    }
  }

  const handleOnRemove=(file: any) => {
    setDeleteList([file.uid, ...deleteList])
    setFileList(pre => pre.filter((val : any) => val.uid !== file.uid))
    return true
  }

  const config:UploadProps = {
    multiple: true,
    listType: "picture",
    maxCount: 3,
    beforeUpload:handleBeforeUpload,
    onRemove:handleOnRemove,
    fileList:fileList,
    customRequest: handleUpload,
    onChange: handleOnChange
  }

  return { proofLoading, configProof:config, fileListDeleteProof:deleteList, proof: fileList }
}

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const {token} = useParams()
  const dispatch = useAppDispatch()
  const { t } = useTranslation();

  const {
    handleUploadLogoProps,
    logoLoading,
    logo
  } = useUploadLogo({t, token: token as string, name: 'logo'})
  const {
    configProof,
    proof
  } = useUploadProof({t, token: token as string})
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if(token){
      checkTokenValid(token).then((valid) => {
        console.log(valid)
        if(valid){
          return 
        }
      })
    }
  }, [])

  const checkTokenValid = async (token: string) => {
    try {
      //const valid = await dispatch(actionCheckSellerRegister(token))
      return true
    } catch (error) {
      console.log(error)
      return navigate('/auth/login')       
    }
  }

  const handleSubmit = async (values: SignUpFormData) => {

    const seller: SellerRegisterRequest = {
      token:token,
      name: values.shopName,
      slogan: values.slogan,
      phone: values.shopPhone,
      facebook: values.fbLink,
      linkedin:values.inLink,
      address: values.address,
      logo: logo.replace('temp', 'images'),
      proof: proof.length > 0 ? proof.map((val: any) => val.url.replace('temp', 'proof')) : []
    }

    try {
      let proofList: any =  []
      if(proof.length > 0){
        proofList = proof.map(file => saveFile({fileUrl:file.url as string, token: token as string, type:'proof'}))
      }
      try {
        const success = await dispatch(actionSellerRegister(seller))
        notificationController.success({message:success, duration: 3})
        Promise.all([...proofList, saveFile({fileUrl: logo, token: token as string})])
        .then(async (arr) =>{
          console.log(arr)
          return navigate(LOGIN_PATH)
        })
        .catch(err => {
          console.log(err)
          //notificationController.success({message:success, duration: 3})
        })  
      } catch (error: any) {
        console.log(error)
        notificationController.error({message:error.message, duration: 5})
      }  
      
      console.log('seller:::', seller)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
        duration: 5
      })
    }
  }

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Row gutter={{ xs: 10, md: 15, xl: 30 }}>
        <Col xs={24} md={24}>
          <S.Title>{t('common.signUp')}</S.Title>
        </Col>

        <Col xs={24} md={12}>
          <Auth.FormItem
            name="shopName"
            label={t('seller.shopName')}
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Auth.FormInput placeholder={t('seller.shopName')} />
          </Auth.FormItem>
        </Col>
        <Col xs={24} md={12}>
          <Auth.FormItem
            name="shopPhone"
            label={t('seller.phone')}
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Auth.FormInput placeholder={t('seller.phonePlaceholder')} />
          </Auth.FormItem>
        </Col>
        <Col xs={24} md={24}>
          <Auth.FormItem
            name="slogan"
            label={t('seller.slogan')}
            rules={[
              { required: true, message: t('common.requiredField') }
            ]}
          >
            <Auth.FormInput placeholder={t('seller.slogan')} />
          </Auth.FormItem>
        </Col>
        <Col xs={24} md={24}>
          <Auth.FormItem
            name="address"
            label={t('seller.address')}
            rules={[
              { required: true, message: t('common.requiredField') }
            ]}
          >
            <Auth.FormInput placeholder={t('seller.address')} />
          </Auth.FormItem>
        </Col>
        <Col xs={24} md={16}>
          
          <Auth.FormItem
              label={t('seller.socialLink')}
              name="fbLink"
            >
            <Auth.FormInput placeholder={t('signup.facebookPlaceholder')} addonBefore={<FacebookIcon/>} />

          </Auth.FormItem>
          <Auth.FormItem
              name="inLink"
          >
            <Auth.FormInput placeholder={t('signup.linkedInPlaceholder')} addonBefore={<LinkedinIcon/>} />
          </Auth.FormItem>
          
        </Col>
        <Col xs={24} md={8}>
          
          <Auth.FormItem
            label={t('seller.logo')}
            name="logo"
          >
            <ImgCrop rotate={true}>
              <Upload
                {...handleUploadLogoProps}
              >

                <Button type="default" icon={logoLoading ? <LoadingOutlined />: <UploadOutlined/ >} >
                  {t('seller.upload')}
                </Button>
              </Upload>
            </ImgCrop>
          </Auth.FormItem>
          
        </Col>
        <Col xs={24} md={24}>
          <Auth.FormItem
            label={t('seller.genuineStore')}
            name="proof"
          >
            <Upload 
                {...configProof}
              >
                <Button type="default" icon={<UploadOutlined />} >
                  {t('seller.proof')}
                </Button>
              </Upload>
          </Auth.FormItem>
        </Col>
        <Col xs={24} md={24}>
          <Auth.ActionsWrapper>
            <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
              <Auth.FormCheckbox>
                <Auth.Text>
                  {t('signup.agree')}{' '}
                  <Link to="/" target={'_blank'}>
                    <Auth.LinkText>{t('signup.termOfUse')}</Auth.LinkText>
                  </Link>{' '}
                  and{' '}
                  <Link to="/" target={'_blank'}>
                    <Auth.LinkText>{t('signup.privacyOPolicy')}</Auth.LinkText>
                  </Link>
                </Auth.Text>
              </Auth.FormCheckbox>
            </BaseForm.Item>
          </Auth.ActionsWrapper>
        </Col>
        <Col xs={24} md={24}>
          <BaseForm.Item noStyle>
            <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
              {t('common.signUp')}
            </Auth.SubmitButton>
          </BaseForm.Item>
        </Col>
        <Col xs={24} md={24}>
          <Auth.FooterWrapper>
            <Auth.Text>
              {t('signup.alreadyHaveAccount')}{' '}
              <Link to={LOGIN_PATH}>
                <Auth.LinkText>{t('common.here')}</Auth.LinkText>
              </Link>
            </Auth.Text>
          </Auth.FooterWrapper>
        </Col>
        </Row>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
