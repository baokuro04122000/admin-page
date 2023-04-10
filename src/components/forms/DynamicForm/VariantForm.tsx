import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '../../common/forms/BaseButtonsForm/BaseButtonsForm';
import { Input } from '../../common/inputs/Input/Input';
import { Select } from '../../common/selects/Select/Select';
import { Button } from '../../common/buttons/Button/Button';
import { notificationController } from '../../../controllers/notificationController';
import * as S from './VariantForm.styles';


export const VariantForm: React.FC<any> = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue.attributes.length as number);
  const [flag, setFlag] = useState(true);
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [form] = BaseButtonsForm.useForm();
  const { t } = useTranslation();

  const types = [
    { label: t('forms.dynamicFormLabels.kindle'), value: 'kindle' },
    { label: t('forms.dynamicFormLabels.paperBack'), value: 'paperBack' },
  ];

  const onFinish = (values = {}) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFieldsChanged(false);
      notificationController.success({ message: t('common.success') });
      console.log(values);
    }, 1000);
  };

  return (
   
      <BaseButtonsForm.List 
        name="attributes"
        initialValue={ initialValue.attributes }
        >
        {(fields, { add, remove }) => {
           
          return (
            <>
              {fields.map((field) => {
              return (
                <>
                 <Row gutter={[30,10]}>
                    <Col span={12}>
                      <BaseButtonsForm.Item
                        name={[field.name, 'type']}
                        label={t('forms.dynamicFormLabels.productType')}
                        key={field.key}
                        initialValue={initialValue.attributes[field.key].type}
                        rules={[{ required: true, message: t('forms.dynamicFormLabels.productTypeRequired') }]}
                      >
                        <Select options={types} defaultValue={initialValue.attributes[field.key].type}/>
                      </BaseButtonsForm.Item>
                    </Col>
                    <Col span={12}>
                      <BaseButtonsForm.Item
                          {...field}
                          label={t('forms.dynamicFormLabels.quantity')}
                          name={[field.name, 'quantity']}
                          fieldKey={[field.key, 'quantity']}
                          initialValue={initialValue.attributes[field.key].quantity}
                          rules={[{ required: true, message: t('forms.dynamicFormLabels.quantityError') }]}
                        >
                          <S.Wrapper>
                            <Input defaultValue={initialValue.attributes[field.key].quantity} />
                          </S.Wrapper>
                        </BaseButtonsForm.Item>
                    </Col>
                 </Row>
                 <Row gutter={[30,10]}>
                     <Col span={12}>
                       <BaseButtonsForm.Item
                         {...field}
                         label={t('forms.dynamicFormLabels.price')}
                         name={[field.name, 'price']}
                         fieldKey={[field.key, 'price']}
                         initialValue={initialValue.attributes[field.key].price}
                         key={field.key}
                         rules={[{ required: true, message: t('forms.dynamicFormLabels.priceError') }]}
                       >
                         <S.Wrapper>
                           <Input defaultValue={initialValue.attributes[field.key].price}/>
                         </S.Wrapper>
                       </BaseButtonsForm.Item>
                     </Col>
                     <Col span={6}>
                       <BaseButtonsForm.Item
                         {...field}
                         label={'Discount'}
                         name={[field.name, 'discount']}
                         key={field.key}
                         initialValue={initialValue.attributes[field.key].discount}
                         fieldKey={[field.key, 'discount']}
                         rules={[{ required: true, message: 'discount is required' }]}
                       >
                         <S.Wrapper>
                           <Input defaultValue={initialValue.attributes[field.key].discount}/>
                         </S.Wrapper>
                       </BaseButtonsForm.Item>
                     </Col>
                     <Col span={6}>
                       <BaseButtonsForm.Item
                           {...field}
                           label={t('forms.dynamicFormLabels.maxOrder')}
                           name={[field.name, 'maxOrder']}
                           fieldKey={[field.key, 'maxOrder']}
                           key={field.key}
                           initialValue={initialValue.attributes[field.key].maxOrder}
                           rules={[{ required: true, message: t('forms.dynamicFormLabels.priceError') }]}
                         >
                           <S.Wrapper>
                             <Input defaultValue={initialValue.attributes[field.key].maxOrder}/>
                               <S.RemoveBtn onClick={() => {
                                remove(field.name)
                                setCount(pre => pre -1 )
                              }} /> 
                           </S.Wrapper>
                         </BaseButtonsForm.Item>
                     </Col>
                 </Row>
                </>
               )
            }
              
              )}
                { count === 2 ? 
                  (<></>) : 
                  (
                    <BaseButtonsForm.Item>
                      <Button type="dashed" onClick={() => {
                        add()
                        setCount(pre => pre + 1 )
                      }} block icon={<PlusOutlined />}>
                        {t('forms.dynamicFormLabels.addAttributes')}
                      </Button>
                    </BaseButtonsForm.Item>
                  )
                }
            </>
          )

        }
        
        }
      </BaseButtonsForm.List>
    
  );
};
