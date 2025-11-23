import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
`;

const CollectionList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Mock data
    const mockCollections = [
        {
            _id: '1',
            title: 'New Arrivals',
            type: 'Automatic',
            condition: 'Tag = new-arrival',
            productsCount: 42,
            status: 'Active',
            image: 'https://bungu.store/cdn/shop/collections/new-arrivals-banner.jpg'
        },
        {
            _id: '2',
            title: 'Black Friday Sale',
            type: 'Manual',
            condition: '-',
            productsCount: 150,
            status: 'Active',
            image: 'https://bungu.store/cdn/shop/collections/black-friday-banner.jpg'
        },
        {
            _id: '3',
            title: 'Writing Utensils',
            type: 'Automatic',
            condition: 'Category = Pens OR Pencils',
            productsCount: 320,
            status: 'Active',
            image: 'https://bungu.store/cdn/shop/collections/writing-utensils.jpg'
        }
    ];

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            // const { data } = await axios.get('http://localhost:5000/api/collections');
            // setCollections(data);
            setCollections(mockCollections);
        } catch (error) {
            console.error('Error fetching collections:', error);
            setCollections(mockCollections);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // await axios.delete(`http://localhost:5000/api/collections/${id}`);
            message.success('Collection deleted successfully');
            setCollections(collections.filter(c => c._id !== id));
        } catch (error) {
            message.error('Failed to delete collection');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            width: 80,
            render: (images) => {
                const imageSrc = Array.isArray(images) && images.length > 0 ? images[0] : null;
                return <Image src={imageSrc} width={50} height={50} style={{ objectFit: 'cover', borderRadius: '4px' }} fallback="https://via.placeholder.com/50" />;
            },
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'Automatic' ? 'blue' : 'purple'}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Conditions',
            dataIndex: 'condition',
            key: 'condition',
        },
        {
            title: 'Products',
            dataIndex: 'productsCount',
            key: 'productsCount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'default'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/collections/edit/${record._id}`)}
                    />
                    <Popconfirm
                        title="Delete collection"
                        description="Are you sure to delete this collection?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredCollections = collections.filter(collection =>
        collection.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <PageHeader>
                <Title>Collections</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/collections/new')}
                >
                    Create Collection
                </Button>
            </PageHeader>

            <FilterBar>
                <Input
                    placeholder="Search collections..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
            </FilterBar>

            <Table
                columns={columns}
                dataSource={filteredCollections}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default CollectionList;
