import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom'
import { BaseButtonsForm } from '../../../components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Card } from '../../../components/common/Card/Card';
import { BaseInputItem } from '../../../components/BaseInputItem/BaseInputItem';
import { TextAreaItem } from '../../../components/product/TextAreaItem/TextAreaItem';
import { CategoryItem } from '../../../components/product/CategoryItem/CategoryItem'
import { UploadItem } from '../../../components/product/UploadItem/UploadItem';
import { BirthdayItem } from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { LanguageItem } from '../../product/LanguageItem/LanguageItem';
import { CitiesItem } from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/CitiesItem/CitiesItem';

import { 
  useAppSelector,
  useAppDispatch
} from '../../../store';
import { notificationController } from '../../../controllers/notificationController';
import { ResponseUploadFile } from '../../../interfaces/authentication';
import { 
  actionAddProduct
} from '../../../store/product/action'
import { AddProductRequest } from '@app/api/openapi-generator';

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

  const productImages = useAppSelector(({product}) => product.productImages)
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const onFinish = useCallback(
     (values: ProductInfoFormValues) => {
      // todo dispatch an action here
      setLoading(true);
      const product: AddProductRequest = {
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
        productPictures: productImages,
        language: values.language
      }
        dispatch(actionAddProduct(product)).then((success) => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: success, duration:5 });
        navigate('/products')
      }).catch((error) => {
        setLoading(false);
        notificationController.error({ message: error ? error.errors.message : "NETWORK ERROR" , duration: 5})
      })
    },
    [t, productImages],
  );

  return (
    <Card>
      <BaseButtonsForm
        form={form}
        name="product"
        loading={isLoading}
        //initialValues={userFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 10, md: 15, xl: 30 }}>
          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('product.addProduct')}</BaseButtonsForm.Title>
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
                {min:1, message:t('product.priceError')},
                {max:9, message:t('product.priceMax')}
              ]}
             />
          </Col>

          <Col xs={24} md={12}>
            <CategoryItem />
          </Col>

          <Col xs={24} md={12}>
            <BaseInputItem 
              name="discount" 
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
                {min: 1, message: t('product.priceMin')},
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
            <UploadItem fileListDefault={[]} />
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
