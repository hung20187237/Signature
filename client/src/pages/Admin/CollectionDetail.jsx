import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Card, DatePicker, Switch, Space, Table, message, Modal, Row, Col, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const CollectionDetail = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';

    const [loading, setLoading] = useState(false);
    const [collectionType, setCollectionType] = useState('manual');
    const [products, setProducts] = useState([]); // Products in collection
    const [allProducts, setAllProducts] = useState([]); // For manual selection modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchCollection();
        }
    }, [id]);

    const fetchCollection = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/collections/${id}`);

            // Format dates for Form
            const formData = {
                ...data,
                startsAt: data.startsAt ? dayjs(data.startsAt) : null,
                endsAt: data.endsAt ? dayjs(data.endsAt) : null,
            };

            form.setFieldsValue(formData);
            setCollectionType(data.type);

            // Fetch products in collection
            fetchCollectionProducts();
        } catch (error) {
            message.error('Failed to fetch collection details');
        } finally {
            setLoading(false);
        }
    };

    const fetchCollectionProducts = async () => {
        try {
            const { data } = await axios.get(`/api/collections/${id}/products`);
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                startsAt: values.startsAt ? values.startsAt.toISOString() : null,
                endsAt: values.endsAt ? values.endsAt.toISOString() : null,
            };

            if (isEdit) {
                await axios.put(`/api/collections/${id}`, payload);
                message.success('Collection updated successfully');
                fetchCollectionProducts(); // Refresh products (rules might have changed)
            } else {
                const { data } = await axios.post('/api/collections', payload);
                message.success('Collection created successfully');
                navigate(`/admin/collections/${data.id}`);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    // --- Manual Collection Logic ---
    const showProductModal = async () => {
        setIsModalVisible(true);
        setModalLoading(true);
        try {
            const { data } = await axios.get('/api/products?limit=100'); // Simple fetch for now
            setAllProducts(data.products);
        } catch (error) {
            message.error('Failed to load products');
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddProduct = async (productId) => {
        try {
            await axios.post(`/api/collections/${id}/products`, { productId });
            message.success('Product added');
            fetchCollectionProducts();
            setIsModalVisible(false);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleRemoveProduct = async (productId) => {
        try {
            await axios.delete(`/api/collections/${id}/products/${productId}`);
            message.success('Product removed');
            fetchCollectionProducts();
        } catch (error) {
            message.error('Failed to remove product');
        }
    };

    const productColumns = [
        { title: 'Image', dataIndex: 'images', key: 'images', render: (imgs) => <img src={imgs && imgs[0]} alt="" style={{ width: 40 }} /> },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                isEdit && collectionType === 'manual' ? (
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveProduct(record.id)} />
                ) : null
            )
        }
    ];

    const modalColumns = [
        { title: 'Image', dataIndex: 'images', key: 'images', render: (imgs) => <img src={imgs && imgs[0]} alt="" style={{ width: 40 }} /> },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" size="small" onClick={() => handleAddProduct(record.id)}>Add</Button>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    {isEdit ? 'Edit Collection' : 'Create Collection'}
                </h1>
                <Space>
                    <Button onClick={() => navigate('/admin/collections')}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()} loading={loading}>
                        Save
                    </Button>
                </Space>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    type: 'manual',
                    isVisible: true,
                    sortOrder: 'best-selling',
                    rules: [{ field: 'tag', operator: 'equals', value: '' }]
                }}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Card title="General Info" style={{ marginBottom: 24 }}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description">
                                <TextArea rows={4} />
                            </Form.Item>
                        </Card>

                        <Card title="Collection Type" style={{ marginBottom: 24 }}>
                            <Form.Item name="type">
                                <Radio.Group onChange={(e) => setCollectionType(e.target.value)} disabled={isEdit}>
                                    <Radio value="manual">Manual</Radio>
                                    <Radio value="automatic">Automatic</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {collectionType === 'automatic' && (
                                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                                    <h3>Conditions</h3>
                                    <Form.Item name="matchPolicy" label="Products must match:" initialValue="all">
                                        <Radio.Group>
                                            <Radio value="all">All conditions</Radio>
                                            <Radio value="any">Any condition</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.List name="rules">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'field']}
                                                            rules={[{ required: true, message: 'Missing field' }]}
                                                        >
                                                            <Select style={{ width: 130 }}>
                                                                <Option value="tag">Product Tag</Option>
                                                                <Option value="price">Price</Option>
                                                                <Option value="name">Product Title</Option>
                                                                <Option value="brand">Brand</Option>
                                                                <Option value="category">Category</Option>
                                                                <Option value="stock">Stock</Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'operator']}
                                                            rules={[{ required: true, message: 'Missing operator' }]}
                                                        >
                                                            <Select style={{ width: 130 }}>
                                                                <Option value="equals">is equal to</Option>
                                                                <Option value="not_equals">is not equal to</Option>
                                                                <Option value="gt">is greater than</Option>
                                                                <Option value="lt">is less than</Option>
                                                                <Option value="contains">contains</Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'value']}
                                                            rules={[{ required: true, message: 'Missing value' }]}
                                                        >
                                                            <Input placeholder="Value" />
                                                        </Form.Item>
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add Condition
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            )}
                        </Card>

                        {isEdit && (
                            <Card
                                title="Products"
                                extra={collectionType === 'manual' && <Button onClick={showProductModal}>Add Product</Button>}
                            >
                                <Table
                                    dataSource={products}
                                    columns={productColumns}
                                    rowKey="id"
                                    pagination={{ pageSize: 5 }}
                                    size="small"
                                />
                            </Card>
                        )}
                    </Col>

                    <Col span={8}>
                        <Card title="Visibility" style={{ marginBottom: 24 }}>
                            <Form.Item name="isVisible" valuePropName="checked" label="Visible on Online Store">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="startsAt" label="Start Date">
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="endsAt" label="End Date">
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>

                        <Card title="Sorting" style={{ marginBottom: 24 }}>
                            <Form.Item name="sortOrder" label="Sort Products By">
                                <Select>
                                    <Option value="best-selling">Best Selling</Option>
                                    <Option value="title-asc">Alphabetically, A-Z</Option>
                                    <Option value="title-desc">Alphabetically, Z-A</Option>
                                    <Option value="price-asc">Price, low to high</Option>
                                    <Option value="price-desc">Price, high to low</Option>
                                    <Option value="created-desc">Date, new to old</Option>
                                    <Option value="created-asc">Date, old to new</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="Collection Image" style={{ marginBottom: 24 }}>
                            <Form.Item name="image" label="Banner Image URL">
                                <Input placeholder="Image URL" />
                            </Form.Item>
                            <Form.Item name="thumbnail" label="Thumbnail Image URL">
                                <Input placeholder="Thumbnail URL" />
                            </Form.Item>
                        </Card>

                        <Card title="SEO Preview">
                            <Form.Item name="seoTitle" label="SEO Title">
                                <Input placeholder="Title for search engines" />
                            </Form.Item>
                            <Form.Item name="seoDescription" label="SEO Description">
                                <TextArea rows={3} placeholder="Description for search engines" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <Modal
                title="Select Products"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    dataSource={allProducts}
                    columns={modalColumns}
                    rowKey="id"
                    loading={modalLoading}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </div>
    );
};

export default CollectionDetail;
