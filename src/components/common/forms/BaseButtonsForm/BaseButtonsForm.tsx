import React from 'react';
import { BaseForm, BaseFormInterface, BaseFormProps } from '../BaseForm/BaseForm';
import { BaseButtonsGroup } from '../components/BaseButtonsGroup/BaseButtonsGroup';
import { BaseFormTitle } from '../components/BaseFormTitle/BaseFormTitle';
import { BaseFormItem } from '../components/BaseFormItem/BaseFormItem';
import { BaseFormList } from '../components/BaseFormList/BaseFormList';

export interface BaseButtonsFormProps extends BaseFormProps {
  isFieldsChanged: boolean;
  setFieldsChanged?: (state: boolean) => void;
  footer?: React.ReactElement;
  loading?: boolean;
}

export const BaseButtonsForm: BaseFormInterface<BaseButtonsFormProps> = ({
  // eslint-disable-next-line react/prop-types
  form,
  // eslint-disable-next-line react/prop-types
  isFieldsChanged,
  // eslint-disable-next-line react/prop-types
  setFieldsChanged,
  // eslint-disable-next-line react/prop-types
  footer,
  // eslint-disable-next-line react/prop-types
  loading = false,
  // eslint-disable-next-line react/prop-types
  children,
  ...props
}) => {
  const [formDefault] = BaseForm.useForm();
  const currentForm = form || formDefault;

  const onCancel = () => {
    currentForm?.resetFields();
    setFieldsChanged && setFieldsChanged(false);
  };

  return (
    <BaseForm form={currentForm} {...props}>
      {children}
      {isFieldsChanged && (footer || <BaseButtonsGroup loading={loading} onCancel={onCancel} />)}
    </BaseForm>
  );
};

BaseButtonsForm.Title = BaseFormTitle;
BaseButtonsForm.Item = BaseFormItem;
BaseButtonsForm.List = BaseFormList;
BaseButtonsForm.useForm = BaseForm.useForm;
BaseButtonsForm.Provider = BaseForm.Provider;
