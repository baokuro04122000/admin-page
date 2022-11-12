import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, Form, TablePaginationConfig, Space } from 'antd';
import { Table } from '../../common/Table/Table';
import { getEditableTableData, BasicTableRow, Pagination } from '../../../api/table.api';
import { EditableCell } from './EditableCell';
import { Button } from '../../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '../../../hooks/useMounted';
import { useAppDispatch, useAppSelector } from '../../../store'
import {
  actionGetProducts,
  actionDeleteProduct,
  actionGetSingleProduct,
  actionQuickEditProduct
} from '../../../store/product/action'
import {
  setProducts
} from '../../../store/product/slice'
import { CategoryInfo, EditQuickProductRequest, ProductDetails, ProductsResponse } from '../../../api/openapi-generator';
import { notificationController } from '../../../controllers/notificationController';
import { SELLER_DASHBOARD_PRODUCTS_SUBPATH } from '../../../constants/routes';
import { ColumnsType } from 'antd/lib/table';

interface ProductDetailsTable extends ProductDetails {
  author?: string,
  key?: string
}

export const EditableTable: React.FC = () => {

  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const products = useAppSelector(({product}) => product.products?.data)
  const totalProduct = useAppSelector(({product}) => product.products?.totalProduct)


  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<Pagination>(
    {
      current: 1,
      pageSize: 5,
      total:5
    })
  const [loading, setLoading] = useState<boolean>(true)
  const [editingKey, setEditingKey] = useState<string>('');
  
  
  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch =  useAppDispatch();
  const { isMounted } = useMounted();

  useEffect(() => {
    dispatch(actionGetProducts({currentPage: 1, sellerId: authUser?.data?.seller?._id, limit: 5}))
    return () => {
      dispatch(setProducts(undefined))
    }
  }, [dispatch])


  const isEditing = (product: ProductDetailsTable) => product._id === editingKey;

  const edit = (product: ProductDetailsTable) => {
    form.setFieldsValue({ name: '', author: '', summary: '',price:0,discountPercent: 0,quantity:0, ...product });
    setEditingKey(product._id ? product._id : '');
  };

  const tableDataFilter: ProductDetailsTable[] = useMemo(() => {
    setLoading(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    if(products){
      const list = products.map((product) => ({...product, key: product._id, author: product?.specs?.author}))
      setPagination({...pagination, total: totalProduct})
      setLoading(false)
      return list
    } else{
      setLoading(false)
      return []
    }
  }, [products])

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as ProductDetailsTable;

      const newData = [...tableDataFilter];
      const index = newData.findIndex((item) => id === item._id);
      if (index > -1) {
        const item = newData[index];
        const productChanged:EditQuickProductRequest = {
          productId: id,
          productChanged:{
            name: row.name ? row.name : item.name ? item.name : "",
            author: row.author ? row.author : item.author ? item.author : "",
            quantity: row.quantity ? row.quantity : item.quantity ? item.quantity : 0,
            discountPercent: row.discountPercent ? row.discountPercent : item.discountPercent ? item.discountPercent : 0,
            price: row.price ? row.price : item.price ? item.price : 0,
            summary: row.summary ? row.summary : item.summary ? item.summary : ""
          }
        } 
        try {
          const success = await dispatch(actionQuickEditProduct(productChanged))
          notificationController.success({message:success, duration: 2})
          newData.splice(index, 1, {
            ...item,
            ...row,
            specs:{author: row.author}
          });
        } catch (error) {
          return
        }
      } else {
        newData.push(row);
      }
      dispatch(setProducts({
        totalProduct: totalProduct,
        data: newData
      }))
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  console.log(products)
  const handleDeleteProduct = async (productId: string) => {
    try {
      const deleted = await dispatch(actionDeleteProduct(productId))
      if(tableDataFilter.length === 1){
        await dispatch(actionGetProducts({currentPage: 
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
      await dispatch(actionGetProducts({currentPage: 
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
      await dispatch(actionGetProducts({currentPage: page, sellerId: authUser?.data?.seller?._id, limit: 5}))
      setPagination({...pagination, current: page})
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
    }
  }

  const columns: ColumnsType<ProductDetailsTable> & { dataIndex?: keyof ProductDetailsTable}[] = useMemo(() => 
  [
    {
      key:'name',
      title: t('common.name'),
      dataIndex: 'name',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'text',
        dataIndex: 'name',
        title: t('common.name'),
        editing: isEditing(record),
      }),
      render: (text: string) => <span>{text}</span>,
    },
    {
      key:'category',
      title: t('product.category'),
      dataIndex: 'category',
      editable: false,
      render: (category: CategoryInfo) => <span>{category.name}</span>
    },
    {
      key:'author',
      title: t('product.author'),
      dataIndex: 'author',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'text',
        dataIndex: 'author', 
        title: t('product.author'),
        editing: isEditing(record),
      }),
      render: (author: string) => <span>{author}</span>
    },
    {
      key:"summary",
      title: t('product.summary'),
      dataIndex: 'summary',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'text',
        dataIndex: 'summary',
        title: record.name,
        editing: isEditing(record),
      }),
      render: (summary) => <span>{summary}</span>
    },
    {
      key:"price",
      title: t('product.price'),
      dataIndex: 'price',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'number',
        dataIndex: 'price',
        title: record.name,
        editing: isEditing(record),
      }),
      render: (price) => <span>{price}</span>
    },
    {
      key:'discount',
      title: t('product.discount'),
      dataIndex: 'discountPercent',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'number',
        dataIndex: 'discountPercent',
        title: record.name,
        editing: isEditing(record),
      }),
      render: (discount) => <span>{discount}</span>
    },
    {
      key:'quantity',
      title: t('product.quantity'),
      dataIndex: 'quantity',
      editable: true,
      onCell: (record: ProductDetails) => ({
        record,
        inputType: 'number',
        dataIndex: 'quantity',
        title: record.name,
        editing: isEditing(record),
      }),
      render: (quantity) => <span>{quantity}</span>
    },
    {
      key:'actions',
      title: t('product.actions'),
      dataIndex: 'slug',
      width: '15%',
      render: (slug: string, record: ProductDetails) => {
        const editable = isEditing(record);
        return (
          <Space >
            {editable ? (
            <>
              <Button type="primary" onClick={() => save(record._id ? record._id : '')}>
                {t('common.save')}
              </Button>
              <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                <Button type="ghost">{t('common.cancel')}</Button>
              </Popconfirm>
            </>
          ) : (
            <>

              <Button type="ghost" disabled={editingKey !== ''} onClick={() => edit(record)}>
                {t('product.quickEdit')}
              </Button>
              <Button
                type="ghost"
                onClick={async() => {
                  await dispatch(actionGetSingleProduct(slug))
                  navigate(`/${SELLER_DASHBOARD_PRODUCTS_SUBPATH}/${slug}`)
                  }
                }
              >
                {t('product.edit')}
              </Button>
              <Popconfirm title={t('product.titlePopconfirmDelete')} onConfirm={() => handleDeleteProduct(record._id ? record._id : '')}>
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
  );
};
