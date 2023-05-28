import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Table as TableAnt } from "antd";
import { Space, Popconfirm, Row, Col, Tag } from "antd";
import { Pagination } from "api/table.api";
import { Table } from "../../common/Table/Table";
import { ColumnsType } from "antd/es/table";
import { Button } from "components/common/buttons/Button/Button";
import { useTranslation } from "react-i18next";
import { notificationController } from "controllers/notificationController";
import moment from "moment";
import {
  OrderDetails,
  OrderDetailsAddress,
  OrderDetailsItemsInner,
  OrderDetailsProduct,
  OrderDetailsUser,
  ProductDetails,
  SpecsProduct,
} from "../../../api/openapi-generator";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  actionAllOrderDoneBySeller,
  actionCancelOrderBySeller,
  actionGetOrderList,
  actionUpdateStatusOrder,
} from "../../../store/product/action";
import { setOrders, setOrdersDone } from "../../../store/product/slice";
import { defineColorByPriority, totalPriceProduct } from "../../../utils/utils";
import { Status } from "../../../components/common/Status/Status";
import { Image } from "antd";
import { Input } from "components/common/inputs/Input/Input";
import * as Auth from "../../../layout/AuthLayout/AuthLayout.styles";
import { BaseForm } from "components/common/forms/BaseForm/BaseForm";


export const BasicTable: React.FC = () => {
  const orders = useAppSelector(({ product }) => product.ordersDone);
  const totalOrders = useAppSelector(({ product }) => product.ordersDone?.total);

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 5,
    total: 5,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [reason, setReason] = useState<any>({});
  const [flag, setFlag] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actionAllOrderDoneBySeller({ currentPage: 1, limit: 5 }));
    return () => {
      dispatch(setOrdersDone(undefined));
    };
  }, []);


 
  const handlePagination = async (page: number, pageSize: number) => {
    try {
      await dispatch(
        actionAllOrderDoneBySeller({ currentPage: page, limit: pageSize })
      );
      setPagination((pre) => ({
        ...pre,
        current: page,
      }));
      setPage(page);
    } catch (error: any) {
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
      });
    }
  };

  const tableDataFilter = useMemo(() => {
    setLoading(true);
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (orders) {
      const list = [...orders.data];
      setPagination({ ...pagination, total: totalOrders });
      setLoading(false);
      return list;
    } else {
      setLoading(false);
      return [];
    }
  }, [orders, page]);

  const columns: ColumnsType<OrderDetails> &
    { dataIndex?: keyof OrderDetails }[] = useMemo(
    () => [
      {
        key:'stt',
        title: 'STT',
        width: '50px',
        dataIndex: 'items',
        render: (name: string, record: any, index: number) => {
          return (
            <>
              {((Number(pagination.current) - 1)*Number(pagination.pageSize) + 1) + index}
            </>
          )
        }
      },
      {
        key: "product",
        title: t("order.product"),
        dataIndex: "items",
        fixed: "left",
        render: (item: any) => <span>{item.at(0).product.name}</span>,
      },
      {
        key: "product",
        title: "Product Images",
        dataIndex: "items",
        fixed: "left",
        render: (item: any) => {
          const image = item.at(0).product?.productPictures[0]?.includes("http")
            ? item.at(0).product.product?.productPictures[0]
            : process.env.REACT_APP_BOOK_ECOMMERCE_HOST +
            item.at(0).product?.productPictures[0];

          return (
            <>
              <Image
                width={50}
                src={image}
                rootClassName="custom-preview-img"
              />
            </>
          );
        },
      },
      {
        key: "variant",
        title: 'Variant',
        dataIndex: "items",
        render: (order: any) => {
          return (
          <span>{
            order.at(0)?.product?.variants?.find((v:any) => v._id === order?.at(0)?.variant).type === 'kindle' ? 'E-Book' : 'HardBook'
            }</span>
        )},
      },
      {
        key: "quantity",
        title: t("order.quantity"),
        dataIndex: "items",
        render: (order: any) => (
          <span>{Number(order.at(0)?.quantity)}</span>
        ),
      },
      {
        key: "name",
        title: t("order.name"),
        dataIndex: "items",
        render: (user: any, order: any) => <span>{order.user.info?.name}</span>,
      },
      {
        key: "meta",
        title: t("order.meta"),
        dataIndex: "items",
        width: "8%",
        render: (user: any, order: any) => (
          <>
            <span>
              {t("order.totalBuy")} {order.user.meta?.totalBuy}
            </span>
            <br />
            <span>
              {t("order.totalCancel")} {order.user.meta?.totalCancel}
            </span>
            <br />
            <span>
              Reject: {order.user.meta?.totalOrderReject}
            </span>
          </>
        ),
      },
      {
        key: "address",
        title: t("order.address"),
        dataIndex: "items",
        width: "12%",
        render: (items: any, order: any) => (
          <>
            <span>
              {t("order.deliveryName")} {order?.address?.name}
            </span>
            <br />
            <span>
              {t("order.phone")}: {order?.address?.phoneNumber}
            </span>
            <br />
            <span>
              {t("order.address")}: {order?.address?.address}
            </span>
          </>
        ),
      },
      {
        key: "amountPaid",
        title: t("order.amountPaid"),
        dataIndex: "items",
        render: (
          order: OrderDetailsItemsInner[],
          orderDetail: OrderDetails
        ) => (
          <span>
            {totalPriceProduct(
              Number(order.at(0)?.price),
              Number(order.at(0)?.quantity),
              Number(order.at(0)?.discount)
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
      },
      {
        key: "paymentType",
        title: t("order.paymentType"),
        dataIndex: "paymentType",
        render: (text: string, order:any) => <span>{order.paymentType}</span>,
      },
      {
        key: "inventory",
        title: t("order.inventory"),
        dataIndex: "items",
        render: (order: any) => {
          const variantId = order.at(0).variant;

          const variant: any = order.at(0).product?.variants?.find(
            (val: any) => val._id === variantId
          );

          return <span>{variant?.quantity}</span>;
        },
      },
      {
        key: "orderAt",
        title: t("order.orderedAt"),
        dataIndex: "items",
        render: (order: OrderDetailsItemsInner[]) => (
          <span>
            {moment(order.at(0)?.createdAt).format("MM/DD/YYYY hh:mm A")}
          </span>
        ),
      },
      {
        title: t("order.status"),
        key: "status",
        dataIndex: "items",
        render: (order: OrderDetailsItemsInner[]) => (
          <Row gutter={[10, 10]}>
            <Col>
              <Status
                color={defineColorByPriority(0)}
                text={order.at(0)?.orderStatus?.at(-1)?.type === 'delivered' && order.at(0)?.orderStatus?.at(-1)?.isCompleted === true ? 'Completed' : 'pending'}
              />
            </Col>
          </Row>
        ),
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    [pagination]
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableDataFilter}
        pagination={{
          ...pagination,
          onChange: handlePagination,
        }}
        loading={loading}
        scroll={{ x: 1500 }}
        bordered
      />
    </>
  );
};
