import React, { useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '../../common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select, Option } from '../../common/selects/Select/Select';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionGetAllCategories } from '../../../store/product/action'
import { setCategories } from '../../../store/product/slice'
const useCategories = () => {
  const categories = useAppSelector(({product}) => product.categories)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(actionGetAllCategories())
    return () => {
      if(categories){
        dispatch(setCategories(undefined))
      }
    }
  }, [])

  const categoriesOption = useMemo(() =>{
    return categories?.map((category) => 
      <Option key={category.slug} value={category._id}>
        <Space align="center">
          {category.name}
        </Space>
      </Option>    
    )
  }, [categories])

  return {categoriesOption}
}
interface Props {
  defaultValue?: string
}
const CategoryItemProduct: React.FC<Props> = ({defaultValue}) => {

  const { categoriesOption } = useCategories()
  const { t } = useTranslation();
  return (
    <BaseButtonsForm.Item 
    name="category" 
    label={t('product.category')}
    rules={[{required: true, message:t('common.requiredField')}]}
    >
      <Select
        defaultValue={defaultValue}
        placeholder={t('product.placeholderCategory')}
      >{categoriesOption}</Select>
    </BaseButtonsForm.Item>
  );
};

export const CategoryItem = React.memo(CategoryItemProduct)
