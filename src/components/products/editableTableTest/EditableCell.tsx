import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import { ProductDetails } from '../../../api/openapi-generator';


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: ProductDetails;
  children: React.ReactNode;
  render?:any;
  key:string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  render,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber min={0}/> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
          children
      )}
    </td>
  );
};
