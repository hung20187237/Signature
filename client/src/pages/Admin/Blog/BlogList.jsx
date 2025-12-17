import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Card, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ status: '', q: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                limit: 20
            };
            const { data } = await axios.get('/api/blog/admin/posts', { params });
            setPosts(data.posts);
        } catch (error) {
            message.error('Failed to fetch blog posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/blog/admin/posts/${id}`);
            message.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            message.error('Failed to delete post');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'thumbnailUrl',
            key: 'thumbnailUrl',
            render: (url) => url ? <img src={url} alt="Thumbnail" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '-'
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/admin/content/blog/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            key: 'category',
            render: (text) => text || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'published') color = 'success';
                if (status === 'draft') color = 'warning';
                if (status === 'archived') color = 'error';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Published',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/content/blog/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete post"
                        description="Are you sure?"
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
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Blog Posts</h1>
                <Link to="/admin/content/blog/new">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New Post
                    </Button>
                </Link>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Space wrap>
                    <Input
                        placeholder="Search title..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        allowClear
                    />
                    <Select
                        placeholder="Filter by Status"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(val) => setFilters({ ...filters, status: val })}
                    >
                        <Option value="published">Published</Option>
                        <Option value="draft">Draft</Option>
                        <Option value="archived">Archived</Option>
                    </Select>
                </Space>
            </Card>

            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={posts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 20 }}
                />
            </Card>
        </div>
    );
};

export default BlogList;
