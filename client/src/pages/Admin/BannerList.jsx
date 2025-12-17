import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Card, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;

const BannerList = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ placement: '', status: '', q: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchBanners();
    }, [filters]);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                limit: 100 // Temporarily fetch generic limit
            };
            const { data } = await axios.get('/api/banners/admin', { params });
            setBanners(data.banners);
        } catch (error) {
            message.error('Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/banners/admin/${id}`);
            message.success('Banner deleted successfully');
            fetchBanners();
        } catch (error) {
            message.error('Failed to delete banner');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url) => <img src={url} alt="Banner" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/admin/content/banners/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Placement',
            dataIndex: 'placement',
            key: 'placement',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'default'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Schedule',
            key: 'schedule',
            render: (_, record) => (
                <div style={{ fontSize: 12 }}>
                    <div>Start: {record.startsAt ? dayjs(record.startsAt).format('YYYY-MM-DD') : 'Now'}</div>
                    {record.endsAt && <div>End: {dayjs(record.endsAt).format('YYYY-MM-DD')}</div>}
                </div>
            )
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            sorter: (a, b) => a.priority - b.priority,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/content/banners/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete banner"
                        description="Are you sure you want to delete this banner?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Banners</h1>
                <Link to="/admin/content/banners/new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Create Banner
                    </Button>
                </Link>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Space wrap>
                    <Input
                        placeholder="Search by title..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        allowClear
                    />
                    <Select
                        placeholder="Filter by Placement"
                        style={{ width: 200 }}
                        allowClear
                        onChange={(val) => setFilters({ ...filters, placement: val })}
                    >
                        <Option value="home_hero">Home Hero</Option>
                        <Option value="home_promo">Home Promo</Option>
                        <Option value="collection_hero">Collection Hero</Option>
                        <Option value="deals_hero">Deals Hero</Option>
                    </Select>
                    <Select
                        placeholder="Filter by Status"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(val) => setFilters({ ...filters, status: val })}
                    >
                        <Option value="active">Active</Option>
                        <Option value="draft">Draft</Option>
                        <Option value="archived">Archived</Option>
                    </Select>
                </Space>
            </Card>

            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={banners}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default BannerList;
