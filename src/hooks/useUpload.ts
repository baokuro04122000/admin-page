import { notificationController } from "../controllers/notificationController"
import { UploadFile } from "antd"
import { RcFile, UploadChangeParam, UploadProps } from "antd/lib/upload"
import { useState } from "react"
import axios from "axios"
export type PropsUpload = {
  t: any;
  token: string;
  login?: boolean
  name?: string
}

export const useUploadLogo = ({t, token, login=false, name}: PropsUpload) => {
  const [logo, setLogo] = useState<string>('')
  const [logoLoading, setLogoLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteList, setDeleteList] = useState<string[]>([])

  const handleBeforeUpload = async (file: RcFile) => {
    const math:string[] = ['image/jpeg','image/png','image/gif', 'image/jpg']
    setLogoLoading(true)
    if(math.indexOf(file.type) === -1){
      notificationController.error({
        message:t('seller.imageInvalidFormat'),
        duration:5
      })
      setLogoLoading(false)
      return false
    }
    const limitFile = file.size / 1024 /1024 < 2
    if(!limitFile){
      setLogoLoading(false)
      notificationController.error({
        message:t('seller.imageLimitSize'),
        duration:5
      })
      return false
    }
    return true
  }

  const handleUpload =async ({file, onSuccess, onError}: any) => {
    const formData = new FormData();
    formData.append('file', file)
    try {
      const { data } = await axios.post(
        `${process.env.SERVER_UPLOAD ? process.env.SERVER_UPLOAD : "http://localhost:9000"}/api/upload/image?login=${login}`,
        formData, {
        headers: {
          'Authorization': `${decodeURIComponent(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess(data, file);
    } catch (err: any) {
      setLogoLoading(false)
      console.log('errr:::', err)
      onError(null, err.response.data);
    }
  }

  const handleOnChange = (file: UploadChangeParam) => {
    setFileList(file.fileList)
    if(file.file.status === 'done'){
      const responseImage = file.file.response
      setFileList([{
        uid:responseImage.uid,
        name: file.file.name,
        thumbUrl:responseImage.url
      }])
      setLogo(responseImage.url)
      setLogoLoading(false)
      return
    } else if(file.file.status === 'error'){
      notificationController.error({
        message:file.file.response ? file.file.response.error.message : "NETWORK ERROR",
        duration:5
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
    maxCount: 1,
    onChange: handleOnChange,
    beforeUpload: handleBeforeUpload,
    onRemove: handleOnRemove,
    fileList: fileList,
    customRequest: handleUpload,
    name: name,

  }

  return {
    logoLoading:logoLoading,
    handleUploadLogoProps:config,
    fileListDeleteLogo:deleteList,
    logo
  }
}



