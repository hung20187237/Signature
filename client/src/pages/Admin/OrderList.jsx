import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, DatePicker, message, Dropdown, Menu } from 'antd';
import {
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    PrinterOutlined,
    MoreOutlined,
    ExportOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const OrderList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // Mock data updated with Country and Order Status
    const mockOrders = [
        {
            _id: '1001',
            createdAt: '2023-11-20T10:30:00Z',
            customer: { name: 'John Doe', email: 'john@example.com' },
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Confirmed',
            total: 5400,
            country: 'JP',
            itemsCount: 3
        },
        {
            _id: '1002',
            createdAt: '2023-11-19T15:45:00Z',
            customer: { name: 'Jane Smith', email: 'jane@example.com' },
            paymentStatus: 'Pending',
            fulfillmentStatus: 'Unfulfilled',
            orderStatus: 'Pending Payment',
            total: 12300,
            country: 'US',
            itemsCount: 5
        },
        {
            _id: '1003',
            createdAt: '2023-11-18T09:15:00Z',
            customer: { name: 'Bob Johnson', email: 'bob@example.com' },
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Fulfilled',
            orderStatus: 'Completed',
            total: 3200,
            country: 'VN',
            itemsCount: 1
        },
        {
            _id: '1004',
            createdAt: '2023-11-18T08:00:00Z',
            customer: { name: 'Alice Brown', email: 'alice@example.com' },
            paymentStatus: 'Refunded',
            fulfillmentStatus: 'Restocked',
            orderStatus: 'Cancelled',
            total: 8900,
            country: 'JP',
            itemsCount: 2
        }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const response = await fetch('http://localhost:5000/api/orders', config);
            const data = await response.json();

            if (response.ok) {
                setOrders(data);
            } else {
                message.error(data.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status, type) => {
        if (type === 'payment') {
            switch (status) {
                case 'Paid': return 'success';
                case 'Pending': return 'warning';
                case 'Refunded': return 'default';
                case 'Failed': return 'error';
                default: return 'default';
            }
        } else if (type === 'fulfillment') {
            switch (status) {
                case 'Fulfilled': return 'success';
                case 'Unfulfilled': return 'warning';
                case 'Partially fulfilled': return 'processing';
                case 'Restocked': return 'default';
                default: return 'default';
            }
        } else { // Order Status
            switch (status) {
                case 'Completed': return 'blue';
                case 'Confirmed': return 'cyan';
                case 'Cancelled': return 'red';
                case 'Pending Payment': return 'gold';
                default: return 'default';
            }
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleBulkAction = (action) => {
        message.info(`${action} applied to ${selectedRowKeys.length} orders`);
        setSelectedRowKeys([]);
    };

    const columns = [
        {
            title: 'Order #',
            dataIndex: '_id',
            key: '_id',
            render: (text) => <a onClick={() => navigate(`/admin/orders/${text}`)}>#{text}</a>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('MMM D, YYYY h:mm A'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{customer.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{customer.email}</div>
                </div>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => <Tag color={getStatusColor(status, 'payment')}>{status}</Tag>,
            filters: [
                { text: 'Paid', value: 'Paid' },
                { text: 'Pending', value: 'Pending' },
                { text: 'Refunded', value: 'Refunded' },
                { text: 'Failed', value: 'Failed' },
            ],
            onFilter: (value, record) => record.paymentStatus === value,
        },
        {
            title: 'Fulfillment',
            dataIndex: 'fulfillmentStatus',
            key: 'fulfillmentStatus',
            render: (status) => <Tag color={getStatusColor(status, 'fulfillment')}>{status}</Tag>,
            filters: [
                { text: 'Fulfilled', value: 'Fulfilled' },
                { text: 'Unfulfilled', value: 'Unfulfilled' },
                { text: 'Partially fulfilled', value: 'Partially fulfilled' },
            ],
            onFilter: (value, record) => record.fulfillmentStatus === value,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `¥${total.toLocaleString()}`,
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (code) => <Tag>{code}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/orders/${record._id}`)}
                    />
                    <Dropdown
                        menu={{
                            items: [
                                { key: 'invoice', label: 'Print Invoice', icon: <FileTextOutlined /> },
                                { key: 'packing', label: 'Print Packing Slip', icon: <PrinterOutlined /> },
                            ],
                            onClick: ({ key }) => message.success(`${key} for #${record._id}`)
                        }}
                        trigger={['click']}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const filteredOrders = orders.filter(order =>
        order._id.includes(searchText) ||
        order.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <PageHeader>
                <Title>Orders</Title>
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Button type="primary" onClick={() => navigate('/admin/orders/new')}>Create Order</Button>
                </Space>
            </PageHeader>

            <FilterBar>
                <Input
                    placeholder="Search by ID, customer..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
                <Select defaultValue="all" style={{ width: 150 }} onChange={() => { }}>
                    <Option value="all">All Status</Option>
                    <Option value="open">Open</Option>
                    <Option value="archived">Archived</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
                <RangePicker />
                <Button icon={<FilterOutlined />}>More Filters</Button>
            </FilterBar>

            {selectedRowKeys.length > 0 && (
                <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span>Selected {selectedRowKeys.length} items</span>
                    <Space>
                        <Button size="small" onClick={() => handleBulkAction('Mark as Paid')}>Mark as Paid</Button>
                        <Button size="small" onClick={() => handleBulkAction('Print Packing Slips')}>Print Packing Slips</Button>
                        <Button size="small" onClick={() => handleBulkAction('Archive')}>Archive</Button>
                    </Space>
                </div>
            )}

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredOrders}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                onRow={(record) => ({
                    onClick: (e) => {
                        // Prevent navigation if clicking checkbox or action buttons
                        if (e.target.closest('.ant-checkbox-wrapper') || e.target.closest('.ant-btn')) return;
                        navigate(`/admin/orders/${record._id}`);
                    },
                    style: { cursor: 'pointer' }
                })}
            />
        </div>
    );
};

export default OrderList;
