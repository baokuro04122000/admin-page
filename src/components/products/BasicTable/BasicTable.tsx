import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Space, Popconfirm, InputRef } from 'antd';
import { Pagination } from '@app/api/table.api';
import { Table } from '../../common/Table/Table';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { Button } from '@components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';

import { CategoryInfo, ProductDetails, SpecsProduct } from '../../../api/openapi-generator';
import { useAppDispatch, useAppSelector } from '../../../store'
import { v4 as uuidv4} from 'uuid'
import { 
  actionGetProducts,
  actionGetSingleProduct,
  actionDeleteProduct
} from '../../../store/product/action'
import { 
  setProducts
} from '../../../store/product/slice'
import { 
  SELLER_DASHBOARD_PRODUCTS_SUBPATH 
} from '../../../constants/routes';
import { Input } from '@components/common/inputs/Input/Input';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';


export const BasicTable: React.FC = () => {
  
  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const products = useAppSelector(({product}) => product.products?.data)
  const totalProduct = useAppSelector(({product}) => product.products?.totalProduct)

  const [pagination, setPagination] = useState<Pagination>(
    {
      current: 1,
      pageSize: 5,
      total:5
    })

  const [loading, setLoading] = useState<boolean>(true)

  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch =  useAppDispatch();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    dispatch(actionGetProducts({page: 1, sellerId: authUser?.data?.seller?._id, limit: 5}))
    return () => {
      dispatch(setProducts(undefined))
    }
  }, [])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };


  const handleDeleteProduct = async (productId: string) => {
    try {
      const deleted = await dispatch(actionDeleteProduct(productId))
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
        notificationController.success({message: deleted ? deleted : '', duration: 3})
        return
      }
      await dispatch(actionGetProducts({page: 
        pagination.current 
        , sellerId: authUser?.data?.seller?._id
        , limit: 5}))  
      notificationController.success({message: deleted ? deleted : '', duration: 3})
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
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR"})
    }
  }

  const tableDataFilter = useMemo(() => {
    setLoading(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    if(products){
      const list = [...products]
      setPagination({...pagination, total: totalProduct})
      setLoading(false)
      return list
    } else{
      setLoading(false)
      return []
    }
  }, [products])

  const columns: ColumnsType<ProductDetails> & { dataIndex?: keyof ProductDetails}[] = useMemo(() =>
  [
    {
      key: uuidv4(),
      title: t('common.name'),
      dataIndex: 'name',
      render: (text: string) => <span key={uuidv4()}>{text}</span>,
    },
    {
      key: uuidv4(),
      title: t('product.category'),
      dataIndex: 'category',
      render: (category: CategoryInfo) => <span key={uuidv4()}>{category.name}</span>
    },
    {
      key: uuidv4(),
      title: t('product.author'),
      dataIndex: 'specs',
      render: (specs: SpecsProduct) => <span key={uuidv4()}>{specs.author}</span>
    },
    {
      key: uuidv4(),
      title: t('product.summary'),
      dataIndex: 'summary',
      render: (summary: string) => <span key={uuidv4()}>{summary}</span>
    },
    {
      key: uuidv4(),
      title: t('product.price'),
      dataIndex: 'price',
      render: (price: number) => <span key={uuidv4()}>{(Number(price)).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      })}</span>
    },
    {
      key: uuidv4(),
      title: t('product.discount'),
      dataIndex: 'discountPercent',
      render: (discount) => <span key={uuidv4()}>{discount}</span>
    },
    {
      key: uuidv4(),
      title: t('product.publisher'),
      dataIndex: 'specs',
      render: (specs) => <span key={uuidv4()}>{specs.publisher}</span>
    },
    // {
    //   title: t('common.tags'),
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: (tags: Tag[]) => (
    //     <Row gutter={[10, 10]}>
    //       {tags.map((tag: Tag) => {
    //         return (
    //           <Col key={tag.value}>
    //             <Status color={defineColorByPriority(tag.priority)} text={tag.value.toUpperCase()} />
    //           </Col>
    //         );
    //       })}
    //     </Row>
    //   ),
    // },
    {
      key: uuidv4(),
      title: t('product.actions'),
      dataIndex: 'slug',
      width: '15%',
      render: (slug: string, record: ProductDetails) => {
        return (
          <Space key={uuidv4()}>
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
          </Space>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ],[]
  ) 

  return (
    <Table
      columns={columns}
      dataSource={tableDataFilter}
      pagination={{
        ...pagination, 
        onChange:handlePagination
      }}
      loading={loading}
      scroll={{ x: 800 }}
      bordered
    />
  );
};
