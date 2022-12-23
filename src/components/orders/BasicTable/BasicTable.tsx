import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'
import { Switch, Table as TableAnt } from 'antd';
import { Space, Popconfirm, Row, Col, Tag } from 'antd';
import { Pagination } from 'api/table.api';
import { Table } from '../../common/Table/Table';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { notificationController } from 'controllers/notificationController';
import moment from 'moment';
import {  OrderDetails, OrderDetailsAddress, OrderDetailsItemsInner, OrderDetailsProduct, OrderDetailsUser, ProductDetails, SpecsProduct } from '../../../api/openapi-generator';
import { useAppDispatch, useAppSelector } from '../../../store'
import { 
  actionGetOrderList,
  actionUpdateStatusOrder
} from '../../../store/product/action'
import { 
  setOrders
} from '../../../store/product/slice'
import { defineColorByPriority, totalPriceProduct } from '../../../utils/utils'
import { Status } from '../../../components/common/Status/Status';

export const BasicTable: React.FC = () => {
  
  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const orders = useAppSelector(({product}) => product.orders?.data)
  const totalOrders = useAppSelector(({product}) => product.orders?.total)

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

 

  useEffect(() => {
    dispatch(actionGetOrderList({currentPage: 1,  limit: 5}))
    return () => {
      dispatch(setOrders(undefined))
    }
  }, [])

  const handleConfirmOrder = async (orderId: string | undefined) => {
    console.log(orderId)
    try {
      await dispatch(actionUpdateStatusOrder(orderId ? orderId : ''))
      dispatch(actionGetOrderList({
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
      await dispatch(actionGetOrderList({currentPage: page, limit: pageSize}))
      await setPagination(pre => ({
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

  const columns: ColumnsType<OrderDetails> & { dataIndex?: keyof OrderDetails}[] = useMemo(() =>
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
      dataIndex: "items",
      render: (order: OrderDetailsItemsInner[]) => <span>{Number(order.at(0)?.quantity)}</span>
    },
    {
      key: 'name',
      title: t('order.name'),
      dataIndex: 'user',
      render: (user: OrderDetailsUser) => <span >{user.info?.firstName + " " + user.info?.lastName}</span>,
    },
    {
      key: 'meta',
      title: t('order.meta'),
      dataIndex: 'user',
      width:"8%",
      render: (user: OrderDetailsUser) => (
        <>
          <span>{t('order.totalBuy')} {user.meta?.totalBuy}</span>
          <br/>
          <span>{t('order.totalCancel')} {user.meta?.totalCancel}</span>
        </>
      )
    },
    {
      key: "address",
      title: t('order.address'),
      dataIndex: 'address',
      width:"12%",
      render: (address: OrderDetailsAddress) => (
        <>
          <span>{t('order.deliveryName')} {address?.name}</span>
          <br/>
          <span>{t('order.phone')}: {address?.phoneNumber}</span>
          <br/>
          <span>{t('order.address')}: {address?.address}</span>
        </>
      )
    },
    {
      key: 'amountPaid',
      title: t('order.amountPaid'),
      dataIndex: 'items',
      render: (order: OrderDetailsItemsInner[], orderDetail: OrderDetails) => 
      <span>
        { (orderDetail.paymentType === 'cod') ?
        (totalPriceProduct(Number(order.at(0)?.price),Number(order.at(0)?.quantity),Number(order.at(0)?.discount))).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })
          
          : 
          (totalPriceProduct(Number(order.at(0)?.price),Number(order.at(0)?.quantity),Number(order.at(0)?.discount))).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
        }
      </span>
    },
    {
      key: 'paymentType',
      title: t('order.paymentType'),
      dataIndex: 'paymentType',
      render: (text: string) => <span>{text}</span>
    },
    {
      key: 'inventory',
      title: t('order.inventory'),
      dataIndex: 'product',
      render: (product: OrderDetailsProduct) => <span>{product.quantity}</span>
    }
    ,
    {
      key: "orderAt",
      title: t('order.orderedAt'),
      dataIndex: 'items',
      render: (order: OrderDetailsItemsInner[]) => <span>{moment(order.at(0)?.createdAt).startOf('hour').fromNow()}</span>
    },
    {
      title: t('order.status'),
      key: 'status',
      dataIndex: 'items',
      render: (order: OrderDetailsItemsInner[]) => (
        <Row gutter={[10, 10]}>
          <Col>
            <Status color={defineColorByPriority(0)} text={order.at(0)?.orderStatus?.at(-1)?.type} />
          </Col>
        </Row>
      ),
    },
    {
      key: 'action',
      title: t('order.actions'),
      dataIndex: 'items',
      width: '15%',
      fixed: 'right',
      render: (order: OrderDetailsItemsInner[]) => {
        return (
          <Space>
            <Popconfirm title={t('order.titleConfirmCancel')} onConfirm={() => handleConfirmOrder(order.at(0)?._id)}>
              {order.at(0)?.orderStatus?.at(-1)?.type === "ordered" ? ( 
              <Button type="dashed" danger>
                    {t('order.cancel')}
                  </Button>) : 
                (
                  <></>
                )
              }
            </Popconfirm>
            <Popconfirm title={t('order.titleConfirm')} onConfirm={() => handleConfirmOrder(order.at(0)?._id)}>
              <>
              {(order.at(0)?.orderStatus?.at(-1)?.type === "shipped" || order.at(0)?.orderStatus?.at(3)?.type === 'delivered') ? (<></>) : 
                (
                  <Button type='primary' block>
                    {t('order.confirm')}
                  </Button>
                )
              }
              </>
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
      scroll={{ x: 1500 }}
      
      bordered
    />
  );
};
