import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, Form, Space, InputRef, Tag } from 'antd';

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
import { actionAddCategory, actionBlockUser, actionEditCategory, actionGetUserList, actionUnBlockUser } from 'store/admin/action';
import { Modal } from 'components/Modal/Modal'
import { Input } from 'components/common/inputs/Input/Input';
import { BaseButtonsForm } from 'components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { setUserList } from 'store/admin/slice';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { formatDay } from 'utils/utils';
export const EditableTable: React.FC = () => {

  const authUser = useAppSelector(({authentication}) => authentication.authUser)
  const users = useAppSelector(({admin}) => admin.userList)

  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<Pagination>(
    {
      current: 1,
      pageSize: 5,
      total:users?.length || 10
    })
  const [loading, setLoading] = useState<boolean>(true)
  const [editingKey, setEditingKey] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('')

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const { t } = useTranslation();
  const navigate = useNavigate()
  const dispatch =  useAppDispatch();

  useEffect(() => {
    dispatch(actionGetUserList({}))
    return () => {
      dispatch(setUserList(undefined))
    }
  }, [dispatch])


  const handleSearch =async (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    const listSearch = new Map<any, any>([
      ['name', {page: 1, name: selectedKeys[0], limit: 5}], 
      ['email', {page: 1, email: selectedKeys[0], limit: 5}],
      ])
    if(selectedKeys[0]){
      dispatch(actionGetUserList(listSearch.get(dataIndex)))
    }else {
      dispatch(actionGetUserList({}))
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  // search
  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleBlockAccount = async (userId: string) => {
    try {
      const message = await dispatch(actionBlockUser(userId));
      dispatch(actionGetUserList({}))
      notificationController.success({message: message, duration: 5})
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
    }
  }

  const handleUnBlockAccount = async (userId: string) => {
    try {
      const message = await dispatch(actionUnBlockUser(userId));
      dispatch(actionGetUserList({}))
      notificationController.success({message: message, duration: 5})
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
    }
  }

  const isEditing = (category: any) => category._id === editingKey;

  const edit = (category: any) => {
    form.setFieldsValue({ name: '', slug:'', ...category });
    setEditingKey(category._id);
  };

  const tableDataFilter: any[] = useMemo(() => {
    setLoading(true)
    // eslint-disable-next-line no-unsafe-optional-chaining
    if(users){
      const list = users.map((user: any) => ({...user, key: user._id}))
      setPagination({...pagination})
      setLoading(false)
      return list
    } else{
      setLoading(false)
      return []
    }
  }, [users])

  const cancel = () => {
    setEditingKey('');
  };

  const handlePagination = async (page: number, pageSize: number) => {
    try {
      await dispatch(actionGetUserList({}))
      setPagination({...pagination, current: page})
    } catch (error: any) {
      notificationController.error({message: error ? error.errors.message : "NETWORK ERROR", duration: 5})
    }
  }

  const columns: ColumnsType<any>  = useMemo(() => 
  [
    {
      key:'stt',
      title: 'Stt',
      width: '50px',
      dataIndex: '_id',
      render: (slug: string, record: any, index: number) => <>
      {((Number(pagination.current) - 1)*Number(pagination.pageSize) + 1) + index}
    </>
    },
    {
      key:'id',
      title: 'User Id',
      dataIndex: '_id',
      render: (id: any) => <span>{id}</span>,
    },
    {
      key:'name',
      title: 'Name',
      dataIndex: 'name',
      render: (name: any, record: any) => <span>{name}</span>,
      ...getColumnSearchProps('name'),
    },
    {
      key:'email',
      title: 'Email',
      dataIndex: 'email',
      render: (email: any) => {
        return <span>{email}</span>
      },
      ...getColumnSearchProps('email'),
    },
    {
      key:'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        return (
          <>
            { status === 'normal' ?
              (<Tag color="green">{status}</Tag>)
             :
             (<Tag color="magenta">{status}</Tag>)}
            
          </>
        )
      }
    },
    {
      key:'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: (a,b) => {
        return 1
      },
      render: (createdAt: string) => <span>{formatDay(createdAt)}</span>
    },
    {
      key:'actions',
      title: t('product.actions'),
      dataIndex: '_id',
      width: '15%',
      render: (_id: string, record: any) => {
        return (
          <Space >
            
            <>

              <Button type="ghost" disabled={editingKey !== ''} onClick={() => edit(record)}>
                Details
              </Button>
              
              {record.status === 'normal' ? (
                <Popconfirm title={'Do you wanna block this account'} onConfirm={() => handleBlockAccount(_id)}>
                
                <Button type="default" danger>
                  Block
                </Button>
              </Popconfirm>

                ): (
                <Popconfirm title={'Do you wanna unblock this account'} onConfirm={() => handleUnBlockAccount(_id)}>
                
                <Button type="ghost">
                  UnBlock
                </Button>
              </Popconfirm>
                )}
              
            </>
          
          </Space>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editingKey])

  return (
    <>
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
