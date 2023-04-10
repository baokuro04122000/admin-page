import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom'
import { Col, Row } from 'antd';
import { BaseButtonsForm } from '../../../components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Card } from '../../../components/common/Card/Card';
import { BaseInputItem } from '../../../components/BaseInputItem/BaseInputItem';
import { TextAreaItem } from '../../../components/product/TextAreaItem/TextAreaItem';
import { CategoryItem } from '../../../components/product/CategoryItem/CategoryItem'
import { UploadItem } from '../../../components/product/UploadItem/UploadItem';
import { BirthdayItem } from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { LanguageItem } from '../../product/LanguageItem/LanguageItem';
import { CitiesItem } from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/CitiesItem/CitiesItem';
import {Dates} from '../../../constants/Dates'
import { 
  useAppSelector,
  useAppDispatch
} from '../../../store';
import { notificationController } from '../../../controllers/notificationController';
import { ResponseUploadFile } from '../../../interfaces/authentication';
import { 
 actionUpdateProduct,
} from 'store/product/action'
import {
  setProduct
} from '../../../store/product/slice'
import { VariantForm } from '../../../components/forms/DynamicForm/VariantForm';
import { saveFile } from '../../../store/authentication/action';

interface ProductInfoFormValues {
  name: string;
  author: string;
  publisher: string;
  printLength: string;
  publicationDate: any;
  language: string;
  price: string;
  category: string;
  discountPercent?: string;
  summary?: string;
  description?: string;
  quantity: string;
  city: string;
  file: ResponseUploadFile[];
}

export const ProductForm: React.FC = () => {

  const product: any = useAppSelector(({product}) => product.product)
  const productImages = useAppSelector(({product}) => product.productImages)
  const token = useAppSelector(({authentication}) => authentication.authUser?.data.accessToken)
  const fileListDefault = useAppSelector(
    ({product}) => product.product?.productPictures?.map(
      (file: any, index: any) => {
        if(index === 0){
          return {
            uid:file,
            name:'main-picture.png',
            status: 'done',
            url: file,
            thumbUrl: file
          }
        }
        return {
          uid:file,
          name:'more-description-picture.png',
          status: 'done',
          url: file,
          thumbUrl: file
        }
      }))
 

  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const productFormValues = useMemo(
    () => {
      const date = product?.specs?.publicationDate ? product?.specs?.publicationDate.split('/') : '';  
      return product 
      ? {
        name: product.name,
        author: product.specs?.author,
        publisher: product.specs?.publisher,
        printLength: product.specs?.printLength,
        publicationDate: Dates.getDate(`${date[1]}/${date[0]}/${date[2]}`),
        language: product.specs?.language,
        price: ""+product.price,
        category:product.category?._id,
        discountPercent: product.discountPercent,
        summary: product.summary,
        description: product.description,
        quantity: ""+product.quantity,
        city: product.specs?.city,
        variants: product.variants,
        } 
      : {}
    }
  , [product])
  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {slug} = useParams()
  
  // useEffect(() => {
  //   return () => {
  //     dispatch(setProduct(undefined))
  //   }
  // }, [])

  const onFinish = useCallback(
     async (values: any) => {
      // todo dispatch an action here
      setLoading(true);
      const product: any = {
        name:values.name,
          specs:[
            {k:'author', v: values.author},
            {k:'publicationDate', v: `${(values.publicationDate.$D <= 9) ?"0"+(values.publicationDate.$D) : (values.publicationDate.$D)}/${((values.publicationDate.$M + 1) <= 9) ?"0"+(values.publicationDate.$M + 1) : (values.publicationDate.$M + 1)}/${values.publicationDate.$y}`},
            {k: 'printLength', v: values.printLength},
            {k: 'publisher', v: values.publisher},
            {k:'language', v: values.language},
            {k:'city', v: values.city}
          ],
        variants: values.attributes.map((variant: any) => ({
          type: variant.type, 
          quantity: Number(variant.quantity),
          discount: Number(variant.discount),
          price: Number(variant.price),
          maxOrder: Number(variant.maxOrder)
        })),
        category: values.category,
        description: values.description,
        productPictures: productImages?.map((image) => image.replace("temp", "images"))
      }
        dispatch(actionUpdateProduct(slug as string,product)).then((success: any) => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: success, duration:5 });
        productImages?.map((file: any) => saveFile({fileUrl: file as string, token: token as string, type:'images', login: true}))
        navigate('/products')
      }).catch ((error: any) => {
        notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
        setLoading(false)
      })
    },
    [t, productImages]
  );

  return (
    <Card>
      <BaseButtonsForm
        form={form}
        name="product"
        loading={isLoading}
        initialValues={productFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 10, md: 15, xl: 30 }}>
        <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('product.basicInfo')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={24}>
            <UploadItem fileListDefault={fileListDefault} />
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="name" 
              label={t('product.name')} 
              type="text"
              placeHolder={t('product.name')}
              rules ={[
                {required: true, message:t('common.requiredField')},
                {min:2, message:t('common.minLength2')},
                {max:150, message:t('common.maxLength150')}
              ]} 
             />
          </Col>

          <Col xs={24} md={12}>
            <CategoryItem />
          </Col>
 
          <Col xs={24} md={24}>
            <TextAreaItem 
              name="description" 
              rows={6} 
              label={t('product.description')}
            />
          </Col>
          
          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('product.detailInfo')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="author" 
              label={t('product.author')} 
              type="text"
              placeHolder={t('product.author')}
              rules ={[
                {required: true, message:t('common.requiredField')},
                {min:2, message:t('common.minLength2')},
                {max:30, message:t('common.maxLength30')}
              ]}
             />
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="publisher" 
              label={t('product.publisher')} 
              type="text"
              placeHolder={t('product.publisher')}
              rules ={[
                {required: true, message:t('common.requiredField')},
                {min:2, message:t('common.minLength2')},
                {max:30, message:t('common.maxLength30')}
              ]}
             />
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="printLength" 
              label={t('product.printLength')} 
              type="text"
              placeHolder={t('product.printLength')}
             />
          </Col>

          <Col xs={24} md={12}>
            <BirthdayItem 
              name="publicationDate"
              label={t('product.publicationDate')}
              format="L"
            />
          </Col>

          <Col xs={24} md={12}>
            <LanguageItem />
          </Col>

          <Col xs={24} md={12}>
            <CitiesItem />
          </Col>

          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('product.variant')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col span={24}>
            <VariantForm initialValue={{attributes: product.variant}}/>
          </Col>
        </Row>
      </BaseButtonsForm>
    </Card>
  );
};
