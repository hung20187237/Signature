import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Radio,
    Upload,
    Space,
    Row,
    Col,
    Card,
    message,
    DatePicker
} from 'antd';
import {
    UploadOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    PlusOutlined,
    MinusCircleOutlined
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

const CollectionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [collectionType, setCollectionType] = useState('manual');

    useEffect(() => {
        if (isEditMode) {
            // Mock fetch
            form.setFieldsValue({
                title: 'New Arrivals',
                description: 'Check out the latest stationery items.',
                type: 'automatic',
                status: 'Active',
                conditions: [
                    { field: 'tag', operator: 'equals', value: 'new-arrival' }
                ]
            });
            setCollectionType('automatic');
        }
    }, [id]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log('Collection values:', values);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success(`Collection ${isEditMode ? 'updated' : 'created'} successfully`);
            navigate('/admin/collections');
        } catch (error) {
            message.error('Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/collections')}>
                        Back
                    </Button>
                    <Title>{isEditMode ? 'Edit Collection' : 'Create Collection'}</Title>
                </Space>
                <Space>
                    <Button onClick={() => form.resetFields()}>Discard</Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={loading}
                    >
                        Save
                    </Button>
                </Space>
            </PageHeader>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    type: 'manual',
                    status: 'Active',
                    conditions: [{ field: 'tag', operator: 'equals', value: '' }]
                }}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <StyledCard title="Collection Details">
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: 'Please enter collection title' }]}
                            >
                                <Input placeholder="e.g. Summer Sale" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={4} placeholder="Collection description..." />
                            </Form.Item>
                        </StyledCard>

                        <StyledCard title="Collection Type">
                            <Form.Item name="type">
                                <Radio.Group onChange={e => setCollectionType(e.target.value)}>
                                    <Space direction="vertical">
                                        <Radio value="manual">
                                            Manual
                                            <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                                                Add products to this collection one by one.
                                            </div>
                                        </Radio>
                                        <Radio value="automatic">
                                            Automated
                                            <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                                                Products that match the conditions below will automatically be included.
                                            </div>
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {collectionType === 'automatic' && (
                                <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
                                    <h3>Conditions</h3>
                                    <Form.List name="conditions">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} gutter={16} align="middle" style={{ marginBottom: 16 }}>
                                                        <Col span={7}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'field']}
                                                                noStyle
                                                            >
                                                                <Select placeholder="Field">
                                                                    <Option value="tag">Product Tag</Option>
                                                                    <Option value="title">Product Title</Option>
                                                                    <Option value="price">Product Price</Option>
                                                                    <Option value="brand">Product Brand</Option>
                                                                    <Option value="category">Product Category</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'operator']}
                                                                noStyle
                                                            >
                                                                <Select placeholder="Operator">
                                                                    <Option value="equals">is equal to</Option>
                                                                    <Option value="not_equals">is not equal to</Option>
                                                                    <Option value="contains">contains</Option>
                                                                    <Option value="greater_than">is greater than</Option>
                                                                    <Option value="less_than">is less than</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'value']}
                                                                noStyle
                                                            >
                                                                <Input placeholder="Value" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={2}>
                                                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add another condition
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            )}
                        </StyledCard>
                    </Col>

                    <Col span={8}>
                        <StyledCard title="Status">
                            <Form.Item name="status" initialValue="Active">
                                <Select>
                                    <Option value="Active">Active</Option>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Archived">Archived</Option>
                                </Select>
                            </Form.Item>
                        </StyledCard>

                        <StyledCard title="Collection Image">
                            <Form.Item name="image">
                                <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </StyledCard>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CollectionForm;
