import React, {useState, useEffect, useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '../../common/forms/BaseButtonsForm/BaseButtonsForm';
import { Upload } from '../../../components/Upload/Upload'
import { Button } from '../../../components/common/buttons/Button/Button';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { notificationController } from '../../../controllers/notificationController';
import { useAppDispatch } from '../../../store';
import { setProductImages } from '../../../store/product/slice'
import { actionDeleteFileListbySeller } from '../../../store/authentication/action'
import { useAppSelector } from '../../../store';
import axios from 'axios';
import { PropsUpload } from '../../../hooks/useUpload';

export const useUploadProductPictures = ({t, token, login=false, fileListDefault}: PropsUpload) => {
  const [imagesLoading, setImagesLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>(fileListDefault)
  const [deleteList, setDeleteList] = useState<string[]>([])
  
  const handleBeforeUpload = (file:RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg']
    setImagesLoading(true)
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:5
      })
      setImagesLoading(false)
      return false
    }
    const limitFile = file.size / 1024 /1024 < 5
    if(!limitFile){
      setImagesLoading(false)
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
          'Authorization': token as string,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileList(pre => [...pre, {...data, name: file.name }])
    } catch (error: any) {
      setImagesLoading(false)
      notificationController.error({
        message: error.response.data ? error.response.data.error.message : 'NETWORK ERROR',
        duration: 5
      })
    }
  }

  const handleOnChange = (file: UploadChangeParam) => {
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
    maxCount: 5 - fileList.length,
    beforeUpload:handleBeforeUpload,
    onRemove:handleOnRemove,
    fileList:fileList,
    customRequest: handleUpload,
    onChange: handleOnChange
  }

  return { imagesLoading, config:config, fileListDelete:deleteList, images: fileList }
}
interface props {
  fileListDefault?: UploadFile[] | any
}
const UploadItemProduct: React.FC<props> = ({fileListDefault}) => {
  const { t } = useTranslation();
  const token  = useAppSelector(({authentication}) => authentication.authUser?.data.accessToken)
  const dispatch = useAppDispatch()
  const {config, images, fileListDelete} = useUploadProductPictures({t, token: token as string, login: true, fileListDefault});
  useEffect(() => {
    
    return () => {
      if(fileListDelete.length > 0){
        dispatch(setProductImages(undefined))
        dispatch(actionDeleteFileListbySeller(fileListDelete))
      }
    }
  },[])
  useEffect(() => {
    if(images.length > 0){
      dispatch(setProductImages(images.map((file: any) => {
        return file.url
      })))
    }
    if(images.length === 0){
      dispatch(setProductImages(undefined))
    }
  }, [images])
  
  return (
    <BaseButtonsForm.Item name="file" label={t('product.productPictures')}>
      <Upload
        {
          ...config
        }
      >
        <Button type="default" icon={<UploadOutlined />} >
          {t('product.upload')}
        </Button>
      </Upload>
    </BaseButtonsForm.Item>
  );
};

export const UploadItem =  React.memo(UploadItemProduct)