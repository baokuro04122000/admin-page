import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Popconfirm, Form, Space, InputRef } from "antd";
import { Table } from "../../common/Table/Table";
import { Pagination } from "../../../api/table.api";
import { EditableCell } from "./EditableCell";
import { Button } from "../../common/buttons/Button/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  actionGetProducts,
  actionDeleteProduct,
  actionGetSingleProduct,
  actionGetProductsByCategoryName,
} from "../../../store/product/action";
import { setProducts } from "../../../store/product/slice";
import { CategoryInfo, ProductsResponse } from "../../../api/openapi-generator";
import { notificationController } from "../../../controllers/notificationController";
import { SELLER_DASHBOARD_PRODUCTS_SUBPATH } from "../../../constants/routes";
import { ColumnsType } from "antd/lib/table";
import {
  ColumnType,
  FilterConfirmProps,
  SorterResult,
} from "antd/es/table/interface";
import { Input } from "components/common/inputs/Input/Input";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { formatDay } from "utils/utils";
import { Image } from "antd";

export const EditableTable: React.FC = () => {
  const authUser = useAppSelector(
    ({ authentication }) => authentication.authUser
  );
  const products = useAppSelector(({ product }) => product.products?.data);
  const totalProduct = useAppSelector(({ product }) => product.products?.total);

  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 5,
    total: 5,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      actionGetProducts({
        page: 1,
        sellerId: authUser?.data?.seller?._id,
        limit: 5,
      })
    );
    return () => {
      dispatch(setProducts(undefined));
    };
  }, []);

  const handleSearch = async (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    const listSearch = new Map<any, any>([
      [
        "name",
        {
          page: 1,
          sellerId: authUser?.data?.seller?._id,
          limit: 5,
          name: selectedKeys[0],
        },
      ],
      [
        "author",
        {
          page: 1,
          sellerId: authUser?.data?.seller?._id,
          limit: 5,
          author: selectedKeys[0],
        },
      ],
    ]);
    if (dataIndex === "category") {
      dispatch(
        actionGetProductsByCategoryName(
          selectedKeys[0],
          5,
          authUser?.data?.seller?._id as string,
          1
        )
      );
      return;
    }
    if (selectedKeys[0]) {
      dispatch(actionGetProducts(listSearch.get(dataIndex)));
    } else {
      dispatch(
        actionGetProducts({
          page: 1,
          sellerId: authUser?.data?.seller?._id,
          limit: 5,
        })
      );
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const tableDataFilter: any[] = useMemo(() => {
    setLoading(true);
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (products) {
      const list = products.map((product: any) => ({
        ...product,
        key: product._id,
        author: product?.specs?.author,
      }));
      setPagination({ ...pagination, total: totalProduct });
      setLoading(false);
      return list;
    } else {
      setLoading(false);
      return [];
    }
  }, [products]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const deleted = await dispatch(actionDeleteProduct(productId));
      if (tableDataFilter.length === 1) {
        await dispatch(
          actionGetProducts({
            page: pagination.current
              ? pagination.current > 1
                ? pagination.current - 1
                : pagination.current
              : 1,
            sellerId: authUser?.data?.seller?._id,
            limit: 5,
          })
        );
        notificationController.success({
          message: deleted ? deleted : "",
          duration: 5,
        });
        return;
      }
      await dispatch(
        actionGetProducts({
          page: pagination.current,
          sellerId: authUser?.data?.seller?._id,
          limit: 5,
        })
      );
      notificationController.success({
        message: deleted ? deleted : "",
        duration: 5,
      });
      return;
    } catch (error: any) {
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
        duration: 5,
      });
      return;
    }
  };

  const handlePagination = async (page: number, pageSize: number) => {
    try {
      console.log("page", page);
      setPagination((pre) => {
        return {
          ...pre,
          current: page,
        };
      });
      await dispatch(
        actionGetProducts({
          page: page,
          sellerId: authUser?.data?.seller?._id,
          limit: 5,
        })
      );
    } catch (error: any) {
      notificationController.error({
        message: error ? error.errors.message : "NETWORK ERROR",
        duration: 5,
      });
    }
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        key: "stt",
        title: "STT",
        width: "60px",
        dataIndex: "name",
        render: (name: string, record: any, index: number) => {
          
          return (
            <>
              {(Number(pagination.current) - 1) * Number(pagination.pageSize) +
                1 +
                index}
            </>
          );
        },
      },
      {
        key: "name",
        title: t("common.name"),
        dataIndex: "name",
        render: (text: string) => <span>{text}</span>,
        ...getColumnSearchProps("name"),
      },
      {
        key: "product",
        title: "Product Images",
        dataIndex: "productPictures",
        fixed: "left",
        render: (productPictures: any) => {
          const image = productPictures[0]?.includes("http")
            ? productPictures[0]
            : process.env.REACT_APP_BOOK_ECOMMERCE_HOST + productPictures[0];

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
        key: "category",
        title: t("product.category"),
        dataIndex: "category",
        ...getColumnSearchProps("category"),
        render: (category: CategoryInfo) => <span>{category.name}</span>,
      },
      {
        key: "author",
        title: t("product.author"),
        dataIndex: "author",
        ...getColumnSearchProps("author"),
        render: (author: string) => <span>{author}</span>,
      },
      {
        key: "kindle",
        title: "Kindle",
        dataIndex: "variants",
        render: (variant: any) => {
          for (const ele of variant) {
            if (ele.type === "kindle") {
              return (
                <>
                  <div>Price: {ele.price}$</div>
                  <div>Quantity: {ele.quantity}</div>
                  <div>Discount: {ele.discount}</div>
                  <div>MaxOrder: {ele.maxOrder}</div>
                </>
              );
            }
          }
          return <>Null</>;
        },
      },
      {
        key: "paperBack",
        title: "Paper Back",
        dataIndex: "variants",
        render: (variant: any) => {
          for (const ele of variant) {
            if (ele.type === "paperBack") {
              return (
                <>
                  <div>Price: {ele.price}$</div>
                  <div>Quantity: {ele.quantity}</div>
                  <div>Discount: {ele.discount}</div>
                  <div>MaxOrder: {ele.maxOrder}</div>
                </>
              );
            }
          }
          return <>Null</>;
        },
      },
      {
        key: "createdAt",
        title: "Created At",
        dataIndex: "createdAt",
        sorter: (a, b) => {
          return 1;
        },
        render: (createdAt: string) => <span>{formatDay(createdAt)}</span>,
      },
      {
        key: "actions",
        title: t("product.actions"),
        dataIndex: "slug",
        width: "15%",
        render: (slug: string, record: any) => {
          return (
            <Space>
              <>
                <Button
                  type="ghost"
                  onClick={async () => {
                    await dispatch(actionGetSingleProduct(slug));
                    navigate(`/${SELLER_DASHBOARD_PRODUCTS_SUBPATH}/${slug}`);
                  }}
                >
                  {t("product.edit")}
                </Button>
                <Popconfirm
                  title={t("product.titlePopconfirmDelete")}
                  onConfirm={() =>
                    handleDeleteProduct(record._id ? record._id : "")
                  }
                >
                  <Button type="default" danger>
                    {t("product.delete")}
                  </Button>
                </Popconfirm>
              </>
            </Space>
          );
        },
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    [editingKey, pagination]
  );

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
