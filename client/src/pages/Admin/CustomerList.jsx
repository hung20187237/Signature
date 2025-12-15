import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Select, message, Row, Col, Card } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [isGuest, setIsGuest] = useState(undefined);

    useEffect(() => {
        fetchCustomers();
    }, [page, keyword, isGuest]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            let url = `/api/users?pageNumber=${page}`;
            if (keyword) url += `&keyword=${keyword}`;
            if (isGuest !== undefined) url += `&isGuest=${isGuest}`;

            const { data } = await axios.get(url);
            setCustomers(data.users);
            setPages(data.pages);
        } catch (error) {
            message.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/admin/customers/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Total Orders',
            dataIndex: 'totalOrders',
            key: 'totalOrders',
            align: 'center',
            render: (val) => val || 0
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            align: 'right',
            render: (val) => `¥${parseFloat(val || 0).toLocaleString()}`
        },
        {
            title: 'Type',
            dataIndex: 'isGuest',
            key: 'isGuest',
            render: (isGuest) => (
                <Tag color={isGuest ? 'orange' : 'green'}>
                    {isGuest ? 'Guest' : 'Registered'}
                </Tag>
            )
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/admin/customers/${record.id}`}>
                        <Button icon={<EyeOutlined />} size="small">View</Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Customers</h1>
            </div>

            <Card>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Input
                            placeholder="Search by name or email"
                            prefix={<SearchOutlined />}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1);
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Filter by Type"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={(val) => {
                                setIsGuest(val);
                                setPage(1);
                            }}
                        >
                            <Option value="false">Registered</Option>
                            <Option value="true">Guest</Option>
                        </Select>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={customers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        total: pages * 20, // Approximate total for pagination UI
                        pageSize: 20,
                        onChange: (p) => setPage(p),
                        showSizeChanger: false
                    }}
                />
            </Card>
        </div>
    );
};

export default CustomerList;
