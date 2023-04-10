import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, Form, Space } from 'antd';

import { Pagination } from '../../../api/table.api';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store'
import {
  actionGetProducts,
  actionDeleteProduct,
  actionGetAllCategories
} from '../../../store/product/action'
import {
  setCategories,
} from '../../../store/product/slice'
import { notificationController } from '../../../controllers/notificationController';
import { ColumnsType } from 'antd/lib/table';
import { Button } from '../../../components/common/buttons/Button/Button';
import { Table } from 'components/common/Table/Table';
import { EditableCell } from 'components/common/tables/editableTable/EditableCell';
import { actionAddCategory, actionEditCategory } from 'store/admin/action';
import { Modal } from 'components/Modal/Modal'
import { Input } from 'components/common/inputs/Input/Input';
import { BaseButtonsForm } from 'components/common/forms/BaseButtonsForm/BaseButtonsForm';
export const EditableTable: React.FC = () => {

  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const categories = useAppSelector(({product}) => product.categories)

  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<Pagination>(
    {
      current: 1,
      pageSize: 5,
      total:categories?.length || 10
    })
  const [loading, setLoading] = useState<boolean>(true)
  const [editingKey, setEditingKey] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('')
  // add category
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk =async () => {
    try {
      const category = await dispatch(actionAddCategory({name: categoryName}));
      const newData = [category, ...categories]
      await dispatch(setCategories(newData));
      setIsModalOpen(false);
      setCategoryName('');
    } catch (error: any) {
      notificationController.error({ message: error ? error.errors.message : "NETWORK ERROR" , duration: 5})
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCategoryName('')
  };

  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch =  useAppDispatch();

  useEffect(() => {
    dispatch(actionGetAllCategories())
    return () => {
      dispatch(setCategories(undefined))
    }
  }, [dispatch])


  const isEditing = (category: any) => category._id === editingKey;

  const edit = (category: any) => {
    form.setFieldsValue({ name: '', slug:'', ...category });
    setEditingKey(category._id);
  };

  const tableDataFilter: any[] = useMemo(() => {
    setLoading(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    if(categories){
      const list = categories.map((category: any) => ({...category, key: category._id}))
      setPagination({...pagination, total: categories.length})
      setLoading(false)
      return list
    } else{
      setLoading(false)
      return []
    }
  }, [categories])

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (slug: string) => {
    try {
      const row = (await form.validateFields());
      const newData = [...tableDataFilter];
      const index = newData.findIndex((item) => slug === item.slug);
      if (index > -1) {
        const item = newData[index]; 
        try {
          const success = await dispatch(actionEditCategory(slug, {name: row.name}))
          notificationController.success({message:success, duration: 2})
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
        } catch (error) {
          return
        }
      } else {
        newData.push(row);
      }
      dispatch(setCategories(newData))
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const deleted = await dispatch(actionDeleteProduct(categoryId))
      if(tableDataFilter.length === 1){
        await dispatch(actionGetProducts({page: 
          (pagination.current) 
          ? 
            (pagination.current > 1) 
            ?  (pagination.current - 1)
            : pagination.current
          : 1 
          , sellerId: authUser?.data?.seller?._id
          , limit: 5}))  
        notificationController.success({message: deleted ? deleted : '', duration: 5})
        return
      }
      await dispatch(actionGetProducts({page: 
        pagination.current 
        , sellerId: authUser?.data?.seller?._id
        , limit: 5}))  
      notificationController.success({message: deleted ? deleted : '', duration: 5})
      return
    } catch (error: any) {
      notificationController.error({message: error?error.errors.message:"NETWORK ERROR", duration:5})
      return
    }
  };

  const handlePagination = async (page: number, pageSize: number) => {
    try {
      await dispatch(actionGetProducts({page: page, sellerId: authUser?.data?.seller?._id, limit: 5}))
      setPagination({...pagination, current: page})
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
    }
  }

  const columns: ColumnsType<any> & { dataIndex?: keyof any}[] = useMemo(() => 
  [
    {
      key:'stt',
      title: 'Stt',
      width: '50px',
      dataIndex: 'slug',
      editable: false,
      render: (slug: string, record: any, index: number) => <>
      {((Number(pagination.current) - 1)*Number(pagination.pageSize) + 1) + index}
    </>
    },
    {
      key:'slug',
      title: 'Slug',
      dataIndex: 'slug',
      editable: false,
      render: (text: string) => <span>{text}</span>,
    },
    {
      key:'name',
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      onCell: (category: any) => ({
        
        inputType: 'text',
        dataIndex: 'name',
        title: 'Name',
        editing: isEditing(category),
      }),
      render: (name: string) => <span>{name}</span>
    },
    {
      key:'actions',
      title: t('product.actions'),
      dataIndex: 'slug',
      width: '15%',
      render: (slug: string, record: any) => {
        const editable = isEditing(record);
        return (
          <Space >
            {editable ? (
            <>
              <Button type="primary" onClick={() => save(slug)}>
                {t('common.save')}
              </Button>
              <Popconfirm title={'Are you sure to cancel manipulation?'} onConfirm={cancel}>
                <Button type="ghost">{t('common.cancel')}</Button>
              </Popconfirm>
            </>
          ) : (
            <>

              <Button type="ghost" disabled={editingKey !== ''} onClick={() => edit(record)}>
                Edit
              </Button>
              
              <Popconfirm title={t('product.titlePopconfirmDelete')} onConfirm={() => handleDeleteCategory(record._id ? record._id : '')}>
                <Button type="default" danger>
                  {t('product.delete')}
                </Button>
              </Popconfirm>
            </>
          )}
          </Space>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editingKey])

  return (
    <>
      <Button style={{marginBottom: '10px'}} type="primary" onClick={showModal} loading={loading}>
        Add Category
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
        <BaseButtonsForm.Item
          name='name'
          label='Name'
          rules={[
            {required: true, message:t('common.requiredField')},
            {min:2, message:t('common.minLength2')},
            {max:150, message:t('common.maxLength150')}
          ]}
        >
          <Input
            name='name'
            type='text'
            placeholder='Name'
            onChange={(val: any) => {
              setCategoryName(val.target.value)
            }}
          />
        </BaseButtonsForm.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={tableDataFilter}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            ...pagination,
            onChange: handlePagination,
          }}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Form>
    </>
  );
};
