import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Switch,
    Upload,
    Space,
    Divider,
    Row,
    Col,
    Card,
    message,
    Tabs,
    Radio
} from 'antd';
import {
    UploadOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    ArrowLeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const { TextArea } = Input;
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

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
            // Transform data if necessary to match form fields
            form.setFieldsValue(data);
            if (data.images) {
                setFileList(data.images.map((url, index) => ({
                    uid: index,
                    name: `image-${index}`,
                    status: 'done',
                    url: url,
                })));
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            message.error('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Handle image uploads here (mock for now)
            const productData = {
                ...values,
                images: fileList.map(file => file.url || file.thumbUrl), // In real app, upload first and get URLs
            };

            if (isEditMode) {
                // await axios.put(`http://localhost:5000/api/products/${id}`, productData);
                message.success('Product updated successfully');
            } else {
                // await axios.post('http://localhost:5000/api/products', productData);
                message.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            message.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <div>
            <PageHeader>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products')}>
                        Back
                    </Button>
                    <Title>{isEditMode ? 'Edit Product' : 'Add New Product'}</Title>
                </Space>
                <Space>
                    <Button onClick={() => form.resetFields()}>Discard</Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={loading}
                    >
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </Button>
                </Space>
            </PageHeader>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    status: 'Active',
                    stock: 0,
                    price: 0,
                    variants: [{}]
                }}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        {/* Basic Information */}
                        <StyledCard title="Basic Information">
                            <Form.Item
                                name="name"
                                label="Product Title"
                                rules={[{ required: true, message: 'Please enter product title' }]}
                            >
                                <Input placeholder="e.g. Jetstream 4&1 Metal Edition" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter product description' }]}
                            >
                                <TextArea rows={6} placeholder="Product description..." />
                            </Form.Item>
                        </StyledCard>

                        {/* Images */}
                        <StyledCard title="Media">
                            <Form.Item label="Product Images">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false} // Prevent auto upload
                                    multiple
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </StyledCard>

                        {/* Variants */}
                        <StyledCard title="Variants">
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ marginBottom: 24, border: '1px solid #f0f0f0', padding: 16, borderRadius: 8 }}>
                                                <Row gutter={16}>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'color']}
                                                            label="Color"
                                                            rules={[{ required: true, message: 'Missing color' }]}
                                                        >
                                                            <Input placeholder="e.g. Black" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'sku']}
                                                            label="SKU"
                                                        >
                                                            <Input placeholder="SKU-123" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'inventory']}
                                                            label="Inventory"
                                                        >
                                                            <InputNumber min={0} style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'price']}
                                                            label="Regular Price"
                                                            rules={[{ required: true, message: 'Missing price' }]}
                                                        >
                                                            <InputNumber
                                                                min={0}
                                                                style={{ width: '100%' }}
                                                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={value => value.replace(/¥\s?|(,*)/g, '')}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'salePrice']}
                                                            label="Sale Price"
                                                        >
                                                            <InputNumber
                                                                min={0}
                                                                style={{ width: '100%' }}
                                                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={value => value.replace(/¥\s?|(,*)/g, '')}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                                                            Remove Variant
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add Variant
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </StyledCard>

                        {/* SEO */}
                        <StyledCard title="Search Engine Optimization (SEO)">
                            <Form.Item name="seoTitle" label="Page Title">
                                <Input placeholder="SEO Title" />
                            </Form.Item>
                            <Form.Item name="seoDescription" label="Meta Description">
                                <TextArea rows={2} placeholder="Meta Description" />
                            </Form.Item>
                            <Form.Item name="handle" label="URL Handle">
                                <Input prefix="/products/" placeholder="product-slug" />
                            </Form.Item>
                        </StyledCard>
                    </Col>

                    <Col span={8}>
                        {/* Status */}
                        <StyledCard title="Status">
                            <Form.Item name="status" initialValue="Active">
                                <Select>
                                    <Option value="Active">Active</Option>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Archived">Archived</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Sales Channels">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <Switch defaultChecked disabled checkedChildren="Online Store" unCheckedChildren="Online Store" />
                                </div>
                            </Form.Item>
                        </StyledCard>

                        {/* Organization */}
                        <StyledCard title="Organization">
                            <Form.Item name="brand" label="Brand">
                                <Select placeholder="Select Brand" showSearch>
                                    <Option value="Uni">Uni</Option>
                                    <Option value="Zebra">Zebra</Option>
                                    <Option value="Kokuyo">Kokuyo</Option>
                                    <Option value="Pilot">Pilot</Option>
                                    <Option value="Pentel">Pentel</Option>
                                    <Option value="Midori">Midori</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="category" label="Category">
                                <Select placeholder="Select Category">
                                    <Option value="Pens">Pens</Option>
                                    <Option value="Pencils">Pencils</Option>
                                    <Option value="Notebooks">Notebooks</Option>
                                    <Option value="Office">Office</Option>
                                    <Option value="Art Supplies">Art Supplies</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="specificType" label="Specific Type">
                                <Input placeholder="e.g. Gel Pen" />
                            </Form.Item>

                            <Form.Item name="characterSeries" label="Character Series">
                                <Select placeholder="Select Series" allowClear>
                                    <Option value="Sanrio">Sanrio</Option>
                                    <Option value="Studio Ghibli">Studio Ghibli</Option>
                                    <Option value="Pokemon">Pokemon</Option>
                                </Select>
                            </Form.Item>
                        </StyledCard>

                        {/* Flags & Campaigns */}
                        <StyledCard title="Flags & Campaigns">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Form.Item name="isNewArrival" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="New Arrival" unCheckedChildren="New Arrival" />
                                </Form.Item>
                                <Divider style={{ margin: '12px 0' }} />
                                <Form.Item name="isBestSeller" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="Best Seller" unCheckedChildren="Best Seller" />
                                </Form.Item>
                                <Divider style={{ margin: '12px 0' }} />
                                <Form.Item name="onSale" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="On Sale" unCheckedChildren="On Sale" />
                                </Form.Item>
                                <Divider style={{ margin: '12px 0' }} />
                                <Form.Item name="isClearance" valuePropName="checked" noStyle>
                                    <Switch checkedChildren="Clearance" unCheckedChildren="Clearance" />
                                </Form.Item>
                            </Space>
                        </StyledCard>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ProductForm;
