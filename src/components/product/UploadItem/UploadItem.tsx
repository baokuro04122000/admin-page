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
const useUploadProductImages = (t:any, dispatch: any, fileListDefault: UploadFile[]) => {
  const [fileList, setFileList] = useState<UploadFile[]>(fileListDefault)
  const [deleteList, setDeleteList] = useState<string[]>([])
  
  const handleBeforeUpload = (file:RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg']
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:5
      })
      return false
    }
    const limitFile = file.size / 1024 /1024 < 5
    if(!limitFile){
      notificationController.error({
        message:t('seller.proofFileLimitSize'),
        duration:5
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
  console.log(fileList)
  const config:UploadProps = {
    multiple:true,
    listType:"picture",
    maxCount:5,
    action:`http://localhost:5000/api/upload-image`,
    beforeUpload:handleBeforeUpload,
    onChange:handleOnChange,
    onRemove:handleOnRemove,
    fileList:fileList,
    name:"file",
  }
  return { configProof:config, fileListDelete:deleteList, productImages: fileList }
}
interface props {
  fileListDefault?: UploadFile[] | any
}
const UploadItemProduct: React.FC<props> = ({fileListDefault}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const {configProof, productImages, fileListDelete} = useUploadProductImages(t, dispatch, fileListDefault)
  useEffect(() => {
    
    return () => {
      if(fileListDelete.length > 0){
        dispatch(setProductImages(undefined))
        dispatch(actionDeleteFileListbySeller(fileListDelete))
      }
    }
  },[])
  useEffect(() => {
    if(productImages.length > 0){
      dispatch(setProductImages(productImages.map((file) => {
        return {
          fileId:file.uid,
          fileLink: file.thumbUrl
        }
      })))
    }
    if(productImages.length === 0){
      dispatch(setProductImages(undefined))
    }
  }, [productImages])
  
  return (
    <BaseButtonsForm.Item name="file" label={t('product.multipleUpload')}>
      <Upload
        {...configProof}
      >
        <Button type="default" icon={<UploadOutlined />} >
          {t('product.upload')}
        </Button>
      </Upload>
    </BaseButtonsForm.Item>
  );
};

export const UploadItem =  React.memo(UploadItemProduct)