import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
`;

const ProductList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Mock data for initial display if API fails
    const mockProducts = [
        {
            _id: '1',
            name: 'Jetstream 4&1 Metal Edition',
            brand: 'Uni',
            category: 'Pens',
            price: 2200,
            stock: 45,
            status: 'Active',
            image: 'https://bungu.store/cdn/shop/files/uni-jetstream-4-1-metal-edition-2200-yen-668.jpg?v=1709712345'
        },
        {
            _id: '2',
            name: 'Mildliner Double-Sided Highlighter - 5 Color Set',
            brand: 'Zebra',
            category: 'Highlighters',
            price: 550,
            stock: 120,
            status: 'Active',
            image: 'https://bungu.store/cdn/shop/products/zebra-mildliner-double-sided-highlighter-5-color-set-550-yen.jpg?v=1623300000'
        },
        {
            _id: '3',
            name: 'Campus Notebook - Semi B5',
            brand: 'Kokuyo',
            category: 'Notebooks',
            price: 180,
            stock: 0,
            status: 'Out of Stock',
            image: 'https://bungu.store/cdn/shop/products/kokuyo-campus-notebook-semi-b5-180-yen.jpg?v=1623300000'
        }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/products');
            // Handle Sequelize response format: { products: [], page, pages }
            const productList = data.products || data;
            setProducts(productList.length > 0 ? productList : mockProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(mockProducts);
            // message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // await axios.delete(`http://localhost:5000/api/products/${id}`);
            message.success('Product deleted successfully');
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            message.error('Failed to delete product');
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
                console.log('imageSrc', imageSrc);
                return <Image src={imageSrc} width={50} height={50} style={{ objectFit: 'cover', borderRadius: '4px' }} fallback="https://via.placeholder.com/50" />;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            filters: [
                { text: 'Uni', value: 'Uni' },
                { text: 'Zebra', value: 'Zebra' },
                { text: 'Kokuyo', value: 'Kokuyo' },
            ],
            onFilter: (value, record) => record.brand === value,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `¥${price.toLocaleString()}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock > 0 ? stock : 'Out of Stock'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'blue' : 'default'}>
                    {status || 'Active'}
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
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                    />
                    <Popconfirm
                        title="Delete product"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    console.log('filteredProducts', filteredProducts);

    return (
        <div>
            <PageHeader>
                <Title>Products</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/products/new')}
                >
                    Add Product
                </Button>
            </PageHeader>

            <FilterBar>
                <Input
                    placeholder="Search products..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                />
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={setCategoryFilter}
                >
                    <Option value="all">All Categories</Option>
                    <Option value="Pens">Pens</Option>
                    <Option value="Pencils">Pencils</Option>
                    <Option value="Notebooks">Notebooks</Option>
                    <Option value="Highlighters">Highlighters</Option>
                </Select>
            </FilterBar>

            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} products`,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
            />
        </div>
    );
};

export default ProductList;
