import { notificationController } from "../controllers/notificationController"
import { UploadFile } from "antd"
import { RcFile, UploadChangeParam, UploadProps } from "antd/lib/upload"
import { useState } from "react"

export const useUploadLogo = (t: any, dispatch: any) => {
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
  const handleOnChange = (file: UploadChangeParam) => {
    setFileList(file.fileList)
    if(file.file.status === 'done'){
      console.log(file.file)
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
        message:file.file.error ? file.file.error : "NETWORK ERROR",
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
    maxCount:1,
    action:`${process.env.SERVER_UPLOAD ? process.env.SERVER_UPLOAD : "http://localhost:9000"}/api/upload/image`,
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

export const useUploadProof = (t:any, dispatch: any) => {
  const [proof, setProof] = useState<any>([])
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
    action:`${process.env.SERVER_UPLOAD ? process.env.SERVER_UPLOAD : "http://localhost:9000"}/api/upload/image`,
    beforeUpload:handleBeforeUpload,
    onChange:handleOnChange,
    onRemove:handleOnRemove,
    fileList:fileList
  }
  return { proofLoading, configProof:config, fileListDeleteProof:deleteList, proof: fileList }
}