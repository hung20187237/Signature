import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/collections');
            setCollections(data.collections);
        } catch (error) {
            message.error('Failed to fetch collections');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/collections/${id}`);
            message.success('Collection deleted successfully');
            fetchCollections();
        } catch (error) {
            message.error('Failed to delete collection');
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/admin/collections/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'automatic' ? 'blue' : 'green'}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Visibility',
            dataIndex: 'isVisible',
            key: 'isVisible',
            render: (isVisible) => (
                <Tag color={isVisible ? 'success' : 'default'}>
                    {isVisible ? 'Visible' : 'Hidden'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/admin/collections/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete collection"
                        description="Are you sure you want to delete this collection?"
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
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Collections</h1>
                <Link to="/admin/collections/new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Create Collection
                    </Button>
                </Link>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={collections}
                    rowKey="id"
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default CollectionList;
