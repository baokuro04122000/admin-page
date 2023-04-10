import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'
import { Switch, Table as TableAnt } from 'antd';
import { Space, Popconfirm, Row, Col, Tag } from 'antd';
import { Pagination } from '@app/api/table.api';
import { Table } from '../../common/Table/Table';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { notificationController } from 'controllers/notificationController';
import moment from 'moment';
import { OrderDetailsItemsInnerOrderStatusInner, OrderDetailsProduct, OrderDetailsShipping, OrderDetailsShippingAddress } from '@app/api/openapi-generator';
import { useAppDispatch, useAppSelector } from '../../../store'
import { 
  actionOrderListShipping,
  actionUpdateStatusOrderShipping
} from '../../../store/product/action'
import { 
   setOrdersShipping
} from '../../../store/product/slice'
import { defineColorByPriority } from '../../../utils/utils'
import { Status } from 'components/common/Status/Status';

export const BasicTable: React.FC = () => {
  
  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const orders = useAppSelector(({product}) => product.ordersShipping?.data)
  const totalOrders = useAppSelector(({product}) => product.ordersShipping?.total)

  const [pagination, setPagination] = useState<any>(
    {
      current: 1,
      pageSize: 5,
      total:5
    })

  const [loading, setLoading] = useState<boolean>(true)

  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch =  useAppDispatch();

 

  useEffect(() => {
    dispatch(actionOrderListShipping({currentPage: 1,  limit: 5}))
    return () => {
      dispatch(setOrdersShipping(undefined))
    }
  }, [])

  const handleConfirmOrder = async (orderId: string | undefined) => {
    console.log(orderId)
    try {
      await dispatch(actionUpdateStatusOrderShipping(orderId ? orderId :''))
      dispatch(actionOrderListShipping({
        currentPage: pagination.current ? pagination.current : 1,  
        limit: pagination.pageSize ?  pagination.pageSize : 5}))
      notificationController.success({
        message:"status changed",
        duration: 3
      })
    } catch (error: any) {
      notificationController.error({message: error?error.errors.message:"NETWORK ERROR", duration:5})
      return
    }
  };

  const handlePagination = async (page: number, pageSize: number) => {
    try {
      console.log(page, pageSize)
      await dispatch(actionOrderListShipping({currentPage: page, limit: pageSize}))
      await setPagination((pre: any) => ({
        ...pre,
        current: page
      }))
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR"})
    }
  }

  const tableDataFilter = useMemo(() => {
    setLoading(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    if(orders){
      const list = [...orders]
      setPagination({...pagination, total: totalOrders})
      setLoading(false)
      return list
    } else{
      setLoading(false)
      return []
    }
  }, [orders])

  const columns: ColumnsType<OrderDetailsShipping> & { dataIndex?: keyof OrderDetailsShipping}[] = useMemo(() =>
  [
    {
      key:'product',
      title:t('order.product'),
      dataIndex: 'product',
      fixed: 'left',
      render: (product: OrderDetailsProduct) => <span>{product.name}</span>
    },
    {
      key:'quantity',
      title: t('order.quantity'),
      dataIndex: "quantity",
      width:"6.5%",
      render: (quantity: number) => <span>{quantity}</span>
    },
    {
      key: 'totalPaid',
      title: t('order.totalPay'),
      dataIndex: 'totalPaid',
      render: (totalPaid: number, order: OrderDetailsShipping) => (
        <>
          <span>{
            (order.paymentType === 'cod') ?
            (totalPaid).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })
            : (0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })
          }</span>
        </>
        )
    },
    {
      key: 'paymentType',
      title: t('order.paymentType'),
      dataIndex: 'paymentType',
      render: (text: string) => <span>{text}</span>
    }
    ,
    {
      key:'address',
      title:t('order.address'),
      dataIndex: "address",
      width:"15%",
      render:(address : OrderDetailsShippingAddress) => {
        return (
          <>
            <span>{t('order.name')} {address.name}</span>
            <br/>
            <span>{t('order.phone')}: {address.phoneNumber}</span>
            <br/>
            <span>{t('order.address')}: {address.address}</span>
          </>
        )
      }
    },
    {
      key: "orderAt",
      title: t('order.orderedAt'),
      dataIndex: 'updatedAt',
      render: (orderAt: string) => <span>{moment(orderAt).startOf('hour').fromNow()}</span>
    },
    {
      title: t('order.status'),
      key: 'status',
      dataIndex: 'orderStatus',
      render: (orderStatus: OrderDetailsItemsInnerOrderStatusInner[]) => (
        <Row gutter={[10, 10]}>
          <Col>
            <Status color={defineColorByPriority(0)} text={orderStatus?.at(-1)?.type} />
          </Col>
        </Row>
      ),
    },
    {
      key: 'action',
      title: t('order.actions'),
      dataIndex: '_id',
      width: '20%',
      fixed: 'right',
      render: (orderId: string, payload: OrderDetailsShipping) => {
        return (
          <Space>
            
              {payload.orderStatus?.at(-1)?.type === "shipped" ? ( 
                <Popconfirm title={t('order.titleConfirmCancel')} onConfirm={() => handleConfirmOrder(orderId)}>
                  <Button type="dashed" danger>
                    {t('order.cancel')}
                  </Button>
                </Popconfirm>
                  ) : 
                (
                  <Popconfirm title={t('order.titleConfirmCancel')} onConfirm={() => handleConfirmOrder(orderId)}>
                    <Button type="dashed" danger>
                      {t('order.deliveryReject')}
                    </Button>
                  </Popconfirm>
                )
              }
            
           
              {(payload.orderStatus?.at(-1)?.type === "delivered" && payload.orderStatus?.at(-1)?.isCompleted === true) ? (<></>) : 
                (
                  <Popconfirm title={t('order.confirm')} onConfirm={() => handleConfirmOrder(orderId)}>
                  <Button type='primary' block>
                    {t('order.confirm')}
                  </Button>
                  </Popconfirm>
                )
              }
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
      scroll={{ x: 1500 }}
      
      bordered
    />
  );
};
