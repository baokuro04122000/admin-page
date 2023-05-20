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
  actionCancelOrderBySeller,
  actionGetOrderList,
  actionUpdateStatusOrder,
} from "../../../store/product/action";
import { setOrders } from "../../../store/product/slice";
import { defineColorByPriority, totalPriceProduct } from "../../../utils/utils";
import { Status } from "../../../components/common/Status/Status";
import { Image } from "antd";
import { Input } from "components/common/inputs/Input/Input";
import * as Auth from "../../../layout/AuthLayout/AuthLayout.styles";
import { BaseForm } from "components/common/forms/BaseForm/BaseForm";

const PermissionCancel = ["ordered", "packed", "shipped"];
const PermissionConfirm = ["ordered", "packed"];
export const BasicTable: React.FC = () => {
  const authUser = useAppSelector(
    ({ authentication }) => authentication.authUser
  );
  const orders = useAppSelector(({ product }) => product.orders?.data);
  const totalOrders = useAppSelector(({ product }) => product.orders?.total);

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
    dispatch(actionGetOrderList({ currentPage: 1, limit: 5 }));
    return () => {
      dispatch(setOrders(undefined));
    };
  }, []);

  const handleConfirmOrder = async (orderId: string | undefined) => {
    try {
      await dispatch(actionUpdateStatusOrder(orderId ? orderId : ""));
      dispatch(
        actionGetOrderList({
          currentPage: pagination.current ? pagination.current : 1,
          limit: pagination.pageSize ? pagination.pageSize : 5,
        })
      );
      notificationController.success({
        message: "status changed",
        duration: 3,
      });
    } catch (error: any) {
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
        duration: 5,
      });
      return;
    }
  };

  const handleCancelOrder = async (orderItemId: string) => {
    dispatch(actionCancelOrderBySeller(orderItemId, reason[orderItemId]))
      .then((message) => {
        setReason((pre: any) => {
          pre[orderItemId] = null
          return pre
        })
        dispatch(actionGetOrderList({ currentPage: 1, limit: 5 }));
        notificationController.success({
          message: message,
          duration: 3,
        });
      })
      .catch((err: any) => {
        notificationController.error({
          message: err ? err.errors.message : "NETWORK ERROR",
          duration: 5,
        });
      });
  };

  const handlePagination = async (page: number, pageSize: number) => {
    try {
      await dispatch(
        actionGetOrderList({ currentPage: page, limit: pageSize })
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
      const list = [...orders];
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
        key: "product",
        title: t("order.product"),
        dataIndex: "product",
        fixed: "left",
        render: (product: OrderDetailsProduct) => <span>{product.name}</span>,
      },
      {
        key: "product",
        title: "Product Images",
        dataIndex: "product",
        fixed: "left",
        render: (product: any) => {
          const image = product?.productPictures[0]?.includes("http")
            ? product?.productPictures[0]
            : process.env.REACT_APP_BOOK_ECOMMERCE_HOST +
              product?.productPictures[0];

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
        key: "quantity",
        title: t("order.quantity"),
        dataIndex: "items",
        render: (order: OrderDetailsItemsInner[]) => (
          <span>{Number(order.at(0)?.quantity)}</span>
        ),
      },
      {
        key: "name",
        title: t("order.name"),
        dataIndex: "user",
        render: (user: any) => <span>{user.info?.name}</span>,
      },
      {
        key: "meta",
        title: t("order.meta"),
        dataIndex: "user",
        width: "8%",
        render: (user: OrderDetailsUser) => (
          <>
            <span>
              {t("order.totalBuy")} {user.meta?.totalBuy}
            </span>
            <br />
            <span>
              {t("order.totalCancel")} {user.meta?.totalCancel}
            </span>
          </>
        ),
      },
      {
        key: "address",
        title: t("order.address"),
        dataIndex: "address",
        width: "12%",
        render: (address: OrderDetailsAddress) => (
          <>
            <span>
              {t("order.deliveryName")} {address?.name}
            </span>
            <br />
            <span>
              {t("order.phone")}: {address?.phoneNumber}
            </span>
            <br />
            <span>
              {t("order.address")}: {address?.address}
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
        render: (text: string) => <span>{text}</span>,
      },
      {
        key: "inventory",
        title: t("order.inventory"),
        dataIndex: "product",
        render: (product: OrderDetailsProduct, data: any) => {
          const variantId = data.items[0].variant;

          const variant: any = product?.variants?.find(
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
                text={order.at(0)?.orderStatus?.at(-1)?.type}
              />
            </Col>
          </Row>
        ),
      },
      {
        key: "action",
        title: t("order.actions"),
        dataIndex: "items",
        width: "15%",
        fixed: "right",
        render: (order: OrderDetailsItemsInner[]) => {
          return (
            <Space>
              <Popconfirm
                title={
                  <div>
                    <div>{t("order.titleConfirmCancel")}</div>
                    <BaseForm
                      layout="vertical"
                      requiredMark="optional"
                      initialValues={{
                        reason: "",
                      }}
                    >
                      <Auth.FormItem
                        name="reason"
                        label={"Reason: "}
                        rules={[
                          {
                            required: true,
                            message: t("common.requiredField"),
                          },
                        ]}
                      >
                        <Auth.FormInput
                          placeholder={"Please enter reason..."}
                          onChange={(e) => {
                            setReason((pre: any) => {
                              pre[order?.at(0)?._id as string] = e.target.value 
                              return pre
                            })
                          }}
                          value={reason[order?.at(0)?._id as string] ? reason[order?.at(0)?._id as string] : '' }
                        />
                      </Auth.FormItem>
                    </BaseForm>
                  </div>
                }
                onCancel={() => setReason((pre:any) => {
                  pre[order?.at(0)?._id as string] = null 
                  return pre
                })}
                onConfirm={() => {
                  if (reason[order?.at(0)?._id as string]) {
                    handleCancelOrder(order.at(0)?._id as string);
                  } else {
                    setFlag(true);
                  }
                }}
                
              >
                {PermissionCancel.includes(
                  order.at(0)?.orderStatus?.at(-1)?.type as string
                ) ? (
                  <Button
                    type="dashed"
                    danger
                  >
                    {t("order.cancel")}
                  </Button>
                ) : (
                  <></>
                )}
              </Popconfirm>
              <Popconfirm
                title={t("order.titleConfirm")}
                onConfirm={() => {
                  handleConfirmOrder(order.at(0)?._id);
                }}
              >
                <>
                  {PermissionConfirm.includes(
                    order.at(0)?.orderStatus?.at(-1)?.type as string
                  ) ? (
                    <Button type="primary" block>
                      {t("order.confirm")}
                    </Button>
                  ) : (
                    <span>{t("order.notAuthorize")}</span>
                  )}
                </>
              </Popconfirm>
            </Space>
          );
        },
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    []
  );

  return (
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
  );
};
