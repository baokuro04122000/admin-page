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


export const VariantForm: React.FC = () => {

  const [count, setCount] = useState(0);
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [form] = BaseButtonsForm.useForm();
  const { t } = useTranslation();

  const types = [
    { label: t('forms.dynamicFormLabels.kindle'), value: t('forms.dynamicFormLabels.kindle') },
    { label: t('forms.dynamicFormLabels.paperBack'), value: t('forms.dynamicFormLabels.paperBack') },
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

  const handleChange = (e: any) => {
    console.log('event::', e)
    form.setFieldsValue({ sights: [] });
  };

  return (
   
      <BaseButtonsForm.List name="attributes">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field) => {
              return (
                <>
                 <Row gutter={[30,10]}>
                    <Col span={12}>
                      <BaseButtonsForm.Item
                        name="type"
                        label={t('forms.dynamicFormLabels.productType')}
                        rules={[{ required: true, message: t('forms.dynamicFormLabels.productTypeRequired') }]}
                      >
                        <Select options={types} onChange={handleChange} />
                      </BaseButtonsForm.Item>
                    </Col>
                    <Col span={12}>
                      <BaseButtonsForm.Item
                          {...field}
                          label={t('forms.dynamicFormLabels.quantity')}
                          name={[field.name, 'quantity']}
                          fieldKey={[field.key, 'quantity']}
                          rules={[{ required: true, message: t('forms.dynamicFormLabels.quantityError') }]}
                        >
                          <S.Wrapper>
                            <Input />
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
                         rules={[{ required: true, message: t('forms.dynamicFormLabels.priceError') }]}
                       >
                         <S.Wrapper>
                           <Input />
                         </S.Wrapper>
                       </BaseButtonsForm.Item>
                     </Col>
                     <Col span={12}>
                       <BaseButtonsForm.Item
                           {...field}
                           label={t('forms.dynamicFormLabels.maxOrder')}
                           name={[field.name, 'maxOrder']}
                           fieldKey={[field.key, 'MaxOrder']}
                           rules={[{ required: true, message: t('forms.dynamicFormLabels.priceError') }]}
                         >
                           <S.Wrapper>
                             <Input />
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
