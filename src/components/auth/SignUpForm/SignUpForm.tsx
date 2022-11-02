import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../../components/common/forms/BaseForm/BaseForm';
import ImgCrop from 'antd-img-crop'
import { Upload } from '../../../components/Upload/Upload'
import { Col, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as Auth from '../../../layout/AuthLayout/AuthLayout.styles';
import * as S from './SignUpForm.styles';
import {notificationController} from '../../../controllers/notificationController'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import { FacebookIcon } from '../../../components/common/icons/FacebookIcon';
import { LinkedinIcon } from '../../../components/common/icons/LinkedinIcon';
import { Button } from '../../../components/common/buttons/Button/Button';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../store'
import { LOGIN_PATH } from '../../../constants/routes'
import { 
  actionCheckSellerRegister,
  actionDeleteFileList,
  actionSellerRegister
} from '../../../store/authentication/action'
import {
  checkEmptyObject
} from '../../../utils/utils'
import { ResponseUploadFile } from '../../../interfaces/authentication';
import { DeleteImagesRequest, SellerRegisterRequest } from '@app/api/openapi-generator';
interface SignUpFormData {
  shopName: string;
  shopPhone: string;
  slogan: string;
  fbLink?: string;
  inLink?:string;
  termOfUse: boolean;
}

const initValues = {
  shopName: '',
  shopPhone: '',
  slogan: '',
  fbLink: '',
  inLink: '',
  termOfUse: true,
};

const useUploadLogo = (t: any, dispatch: any) => {
  const [logo, setLogo] = useState<ResponseUploadFile>({})
  const [logoLoading, setLogoLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteList, setDeleteList] = useState<string[]>([])

  const handleBeforeUpload = async (file: RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg']
    setLogoLoading(true)
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:null
      })
      setLogoLoading(false)
      return false
    }
    const limitFile = file.size / 1024 /1024 < 2
    if(!limitFile){
      setLogoLoading(false)
      notificationController.error({
        message:t('seller.imageLimitSize'),
        duration:null
      })
      return false
    }
    return true
  }
  const handleOnChange = (file: UploadChangeParam) => {
    setFileList(file.fileList)
    if(file.file.status === 'done'){
      console.log(file.file)
      const responseImage:ResponseUploadFile = file.file.response
      setFileList([{
        uid:responseImage.fileId ? responseImage.fileId : "error",
        name: file.file.name,
        thumbUrl:responseImage.fileLink
      }])
      setLogo(responseImage)
      setLogoLoading(false)
      return
    } else if(file.file.status === 'error'){
      notificationController.error({
        message:file.file.error ? file.file.error : "NETWORK ERROR",
        duration:null
      })
      return
    }

  }
  const handleOnRemove = (file: any) => {
    setDeleteList([file.uid, ...deleteList])
    return true
  }

  const config: UploadProps = {
    listType:"picture",
    maxCount:1,
    action:`${process.env.SERVER_UPLOAD}/api/upload-image`,
    onChange: handleOnChange,
    beforeUpload: handleBeforeUpload,
    onRemove:handleOnRemove,
    fileList:fileList,
  }
  return {
    logoLoading:logoLoading,
    handleUploadLogoProps:config,
    fileListDeleteLogo:deleteList,
    logo
  }
}

const useUploadProof = (t:any, dispatch: any) => {
  const [proof, setProof] = useState<ResponseUploadFile[]>([])
  const [proofLoading, setProofLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteList, setDeleteList] = useState<string[]>([])
  
  const handleBeforeUpload = (file:RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg', 'file/dox', 'file/pdf']
    setProofLoading(true)
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:null
      })
      setProofLoading(false)
      return false
    }
    const limitFile = file.size / 1024 /1024 < 5
    if(!limitFile){
      setProofLoading(false)
      notificationController.error({
        message:t('seller.proofFileLimitSize'),
        duration:null
      })
      return false
    }
    return true
  }

  const handleOnChange = (file: UploadChangeParam) => {
    let newFileList: any = [...file.fileList];
    newFileList = file.fileList.map(file => {
      if (file.response) {
        return {
          uid:file.response.fileId ? file.response.fileId : "error",
          name: file.name,
          thumbUrl:file.response.fileLink
        }
      }
      return file;
    });
    setFileList(newFileList);
  }
  const handleOnRemove=(file: any) => {
    setDeleteList([file.uid, ...deleteList])
    return true
  }
  const config:UploadProps = {
    multiple:true,
    listType:"picture",
    maxCount:5,
    action:`${process.env.SERVER_UPLOAD}/api/upload-image`,
    beforeUpload:handleBeforeUpload,
    onChange:handleOnChange,
    onRemove:handleOnRemove,
    fileList:fileList
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
    fileListDeleteLogo,
    logo
  } = useUploadLogo(t, dispatch)
  const {
    configProof,
    fileListDeleteProof,
    proof
  } = useUploadProof(t, dispatch)
  const [isLoading, setLoading] = useState(false);
  
  
  useEffect(() => {
    if(token){
      console.log(token)
      checkTokenValid(token).then((valid) => {
        console.log(valid)
        if(valid){
          return 
        }
      })
    }
    return () => {
      const filesDelete = [...fileListDeleteLogo, ...fileListDeleteProof]
      const deleteFiles: DeleteImagesRequest = {
        id: 'bad user',
        token: token,
        fileList: filesDelete
      }
      dispatch(actionDeleteFileList(deleteFiles))
    }
  }, [])

  const checkTokenValid = async (token: string) => {
    try {
      const valid = await dispatch(actionCheckSellerRegister(token))
      return valid
    } catch (error) {
      console.log(error)
      return navigate('/auth/login')       
    }
  }

  const handleSubmit = useCallback(async (values: SignUpFormData) => {

      const seller: SellerRegisterRequest = {
        token:token,
        name: values.shopName,
        slogan: values.slogan,
        phone: values.shopPhone,
        fbLink: values.fbLink,
        inLink:values.inLink,
        logo: checkEmptyObject(logo) ? {} : {
          fileLink: logo.fileLink,
          fileId: logo.fileId
        },
        proof: proof.length > 0 
        ? proof.map((file: any) => {
          return {
            fileLink: file.thumbUrl,
            fileId: file.uid
          }
        }) 
        : []
      } 
      try {
        const filesDelete = [...fileListDeleteLogo, ...fileListDeleteProof]
        const deleteFiles: DeleteImagesRequest = {
          id: values.shopName,
          token: token,
          fileList: filesDelete
        }
        await dispatch(actionDeleteFileList(deleteFiles))
        await dispatch(actionSellerRegister(seller))
        return navigate(LOGIN_PATH)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error)
        notificationController.error({
          message: error ? error.errors.message : "NETWORK ERROR"
        })
      }
  }, [token, logo, proof, fileListDeleteLogo, fileListDeleteProof, dispatch, navigate])


  

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
