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
  actionUpdateProduct
} from '../../../store/product/action'
import {
  setProduct
} from '../../../store/product/slice'
import { EditProductRequest } from '../../../api/openapi-generator';

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

  const product = useAppSelector(({product}) => product.product)
  const productImages = useAppSelector(({product}) => product.productImages)
  const fileListDefault = useAppSelector(
    ({product}) => product.product?.productPictures?.map(
      (file, index) => {
        if(index === 0){
          return {
            uid:file.fileId,
            name:'main-picture.png',
            status: 'done',
            url: file.fileLink,
            thumbUrl: file.fileLink
          }
        }
        return {
          uid:file.fileId,
          name:'more-description-picture.png',
          status: 'done',
          url: file.fileLink,
          thumbUrl: file.fileLink
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
        } 
      : {}
    }
  , [product])

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {slug} = useParams()
  
  useEffect(() => {
    return () => {
      dispatch(setProduct(undefined))
    }
  }, [dispatch])

  const onFinish = useCallback(
     async (values: ProductInfoFormValues) => {
      // todo dispatch an action here
      setLoading(true);
      const productEdit: EditProductRequest = {
        product: {
          name:values.name,
          author: values.author,
          category: values.category,
          publicationDate: `${(values.publicationDate.$D <= 9) ?"0"+(values.publicationDate.$D) : (values.publicationDate.$D)}/${((values.publicationDate.$M + 1) <= 9) ?"0"+(values.publicationDate.$M + 1) : (values.publicationDate.$M + 1)}/${values.publicationDate.$y}`,
          printLength: values.printLength ? +values.printLength : undefined,
          publisher:values.publisher,
          discountPercent: values.discountPercent ? +values.discountPercent : 0,
          price: +values.price,
          summary: values.summary,
          description: values.description,
          quantity:+values.quantity,
          city: values.city,
          language: values.language,
          productPictures: productImages
        },
        slug: slug
      }
      try {
        const message = await dispatch(actionUpdateProduct(productEdit))
        notificationController.success({message: message, duration: 5})
        setLoading(false)
        navigate('/products')
      } catch (error: any) {
        notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
        setLoading(false)
      }
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
              <BaseButtonsForm.Title>{t('product.editProduct')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
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
            <BaseInputItem 
              name="price" 
              label={t('product.price')} 
              type="text"
              placeHolder={t('product.price')}
              rules ={[
                {required: true, message:t('common.requiredField')},
                {max:9, message:t('product.priceMax')}
              ]}
             />
          </Col>

          <Col xs={24} md={12}>
            <CategoryItem defaultValue={product?.category?._id} />
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="discountPercent" 
              label={t('product.discountPercent')} 
              type="text"
              placeHolder={t('product.discountPercent')}
             />
          </Col>
          
          <Col xs={24} md={12}>
            <BaseInputItem 
              name="quantity" 
              label={t('product.quantity')} 
              type="text"
              placeHolder={t('product.quantity')}
              rules={[
                {required: true, message:t('common.requiredField')},
                {max: 6, message: t('product.priceMax')}
              ]}
             />
          </Col>

          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('product.productDescription')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={24}>
            <TextAreaItem 
              name="summary" 
              rows={2} 
              label={t('product.summary')}
              rules={[
                {max: 150, message: t('common.maxLength150')}
              ]}
            />
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
              <BaseButtonsForm.Title>{t('product.productPictures')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={24}>
            <UploadItem fileListDefault={fileListDefault} />
          </Col>

          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.address')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={12}>
            <CitiesItem />
          </Col>

        </Row>
      </BaseButtonsForm>
    </Card>
  );
};
