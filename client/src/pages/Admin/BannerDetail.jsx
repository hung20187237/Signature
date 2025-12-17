import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, Switch, DatePicker, Row, Col, message, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const BannerDetail = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = id && id !== 'new';
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewMobileImage, setPreviewMobileImage] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchBanner();
        } else {
            form.setFieldsValue({
                status: 'draft',
                placement: 'home_hero',
                layout: 'full_width_image',
                priority: 100,
                openInNewTab: false
            });
        }
    }, [id]);

    const fetchBanner = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/banners/admin/${id}`);
            form.setFieldsValue({
                ...data,
                startsAt: data.startsAt ? dayjs(data.startsAt) : null,
                endsAt: data.endsAt ? dayjs(data.endsAt) : null,
            });
            if (data.imageUrl) setPreviewImage(data.imageUrl);
            if (data.mobileImageUrl) setPreviewMobileImage(data.mobileImageUrl);
        } catch (error) {
            message.error('Failed to fetch banner details');
        } finally {
            setLoading(false);
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
                await axios.put(`/api/banners/admin/${id}`, payload);
                message.success('Banner updated');
            } else {
                await axios.post('/api/banners/admin', payload);
                message.success('Banner created');
            }
            navigate('/admin/content/banners');
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }, field) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess(data.filePath);

            // Update form and preview
            form.setFieldsValue({ [field]: data.filePath });
            if (field === 'imageUrl') setPreviewImage(data.filePath);
            if (field === 'mobileImageUrl') setPreviewMobileImage(data.filePath);

            message.success('Image uploaded successfully');
        } catch (err) {
            onError(err);
            message.error('Upload failed');
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    {isEdit ? 'Edit Banner' : 'Create Banner'}
                </h1>
                <Button onClick={() => navigate('/admin/content/banners')}>Cancel</Button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Card title="Content" style={{ marginBottom: 24 }}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Black Friday Sale" />
                            </Form.Item>
                            <Form.Item name="subtitle" label="Subtitle">
                                <Input placeholder="e.g. Up to 50% Off" />
                            </Form.Item>
                            <Form.Item name="description" label="Description">
                                <TextArea rows={3} />
                            </Form.Item>
                        </Card>

                        <Card title="Media & Link" style={{ marginBottom: 24 }}>
                            {/* Desktop Image Upload */}
                            <Form.Item label="Desktop Image" required tooltip="Primary banner image">
                                <Form.Item name="imageUrl" noStyle rules={[{ required: true, message: 'Please upload an image' }]}>
                                    <Input type="hidden" />
                                </Form.Item>

                                <Upload
                                    accept="image/*"
                                    customRequest={(options) => handleUpload(options, 'imageUrl')}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload Desktop Image</Button>
                                </Upload>

                                {previewImage && (
                                    <div style={{ marginTop: 16, border: '1px solid #eee', padding: 8, borderRadius: 4, background: '#fafafa' }}>
                                        <img src={previewImage} alt="Desktop Preview" style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto' }} />
                                    </div>
                                )}
                            </Form.Item>

                            {/* Mobile Image Upload */}
                            <Form.Item label="Mobile Image (Optional)" tooltip="Optimized for smaller screens">
                                <Form.Item name="mobileImageUrl" noStyle>
                                    <Input type="hidden" />
                                </Form.Item>

                                <Upload
                                    accept="image/*"
                                    customRequest={(options) => handleUpload(options, 'mobileImageUrl')}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload Mobile Image</Button>
                                </Upload>

                                {previewMobileImage && (
                                    <div style={{ marginTop: 16, border: '1px solid #eee', padding: 8, borderRadius: 4, background: '#fafafa', width: '200px' }}>
                                        <img src={previewMobileImage} alt="Mobile Preview" style={{ width: '100%', display: 'block' }} />
                                    </div>
                                )}
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="link" label="CTA Link">
                                        <Input placeholder="/collections/all" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="linkText" label="CTA Text">
                                        <Input placeholder="Shop Now" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="openInNewTab" valuePropName="checked">
                                <Switch checkedChildren="Open in new tab" unCheckedChildren="Open in new tab" />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Settings" style={{ marginBottom: 24 }}>
                            <Form.Item name="status" label="Status">
                                <Select>
                                    <Option value="draft">Draft</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="archived">Archived</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="placement" label="Placement" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="home_hero">Home Hero Slider</Option>
                                    <Option value="home_promo">Home Promo Strip</Option>
                                    <Option value="collection_hero">Collection Hero</Option>
                                    <Option value="deals_hero">Deals Hero</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="layout" label="Layout Type">
                                <Select>
                                    <Option value="full_width_image">Full Width Image</Option>
                                    <Option value="split_image_text">Split Image/Text</Option>
                                    <Option value="centered_card">Centered Card</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="priority" label="Priority (Lower shows first)">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>

                        <Card title="Schedule">
                            <Form.Item name="startsAt" label="Start Date">
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="endsAt" label="End Date">
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        </Card>

                        <Button type="primary" onClick={() => form.submit()} block size="large" loading={loading}>
                            Save Banner
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default BannerDetail;
