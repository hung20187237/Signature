import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, DatePicker, Row, Col, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const BlogDetail = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = id && id !== 'new';
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchMetadata();
        if (isEdit) {
            fetchPost();
        } else {
            form.setFieldsValue({
                status: 'draft',
                authorName: 'Bungu Team'
            });
        }
    }, [id]);

    const fetchMetadata = async () => {
        try {
            const [catRes, tagRes] = await Promise.all([
                axios.get('/api/blog/categories'),
                axios.get('/api/blog/tags')
            ]);
            setCategories(catRes.data);
            setTags(tagRes.data);
        } catch (error) {
            console.error('Failed to fetch metadata');
        }
    };

    const fetchPost = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/blog/admin/posts/${id}`);
            form.setFieldsValue({
                ...data,
                publishedAt: data.publishedAt ? dayjs(data.publishedAt) : null,
                tagIds: data.tags ? data.tags.map(t => t.id) : []
            });
            if (data.thumbnailUrl) setPreviewImage(data.thumbnailUrl);
        } catch (error) {
            message.error('Failed to fetch post details');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                publishedAt: values.publishedAt ? values.publishedAt.toISOString() : null,
            };

            if (isEdit) {
                await axios.put(`/api/blog/admin/posts/${id}`, payload);
                message.success('Post updated');
            } else {
                await axios.post('/api/blog/admin/posts', payload);
                message.success('Post created');
            }
            navigate('/admin/content/blog');
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e) => {
        if (!isEdit) {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            form.setFieldsValue({ slug });
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess(data.filePath);

            // Update form and preview
            form.setFieldsValue({ thumbnailUrl: data.filePath });
            setPreviewImage(data.filePath);

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
                    {isEdit ? 'Edit Post' : 'New Post'}
                </h1>
                <Button onClick={() => navigate('/admin/content/blog')}>Cancel</Button>
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
                                <Input placeholder="Enter title" onChange={handleTitleChange} />
                            </Form.Item>
                            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                                <Input placeholder="url-slug" />
                            </Form.Item>
                            <Form.Item name="content" label="Content (HTML support)" rules={[{ required: true }]}>
                                <TextArea rows={15} placeholder="<p>Write your content here...</p>" />
                            </Form.Item>
                            <Form.Item name="excerpt" label="Excerpt">
                                <TextArea rows={3} placeholder="Short summary for SEO and lists" />
                            </Form.Item>
                        </Card>

                        <Card title="SEO" style={{ marginBottom: 24 }}>
                            <Form.Item name="seoTitle" label="SEO Title">
                                <Input placeholder="Custom title for search engines" />
                            </Form.Item>
                            <Form.Item name="seoDescription" label="Meta Description">
                                <TextArea rows={2} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Publishing" style={{ marginBottom: 24 }}>
                            <Form.Item name="status" label="Status">
                                <Select>
                                    <Option value="draft">Draft</Option>
                                    <Option value="published">Published</Option>
                                    <Option value="archived">Archived</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="publishedAt" label="Publish Date">
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="authorName" label="Author">
                                <Input />
                            </Form.Item>
                        </Card>

                        <Card title="Organization" style={{ marginBottom: 24 }}>
                            <Form.Item name="categoryId" label="Category">
                                <Select placeholder="Select category">
                                    {categories.map(c => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="tagIds" label="Tags">
                                <Select mode="multiple" placeholder="Select tags">
                                    {tags.map(t => (
                                        <Option key={t.id} value={t.id}>{t.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="Media">
                            <Form.Item name="thumbnailUrl" noStyle>
                                <Input type="hidden" />
                            </Form.Item>

                            <Upload
                                accept="image/*"
                                customRequest={handleUpload}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />} block>Click to Upload Thumbnail</Button>
                            </Upload>

                            {previewImage && (
                                <div style={{ marginTop: 16, border: '1px solid #eee', padding: 8, borderRadius: 4, background: '#fafafa' }}>
                                    <img src={previewImage} alt="Thumbnail Preview" style={{ width: '100%', display: 'block' }} />
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewImage('');
                                            form.setFieldsValue({ thumbnailUrl: '' });
                                        }}
                                        style={{ marginTop: 8, width: '100%' }}
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                        </Card>

                        <Button type="primary" onClick={() => form.submit()} block size="large" loading={loading} style={{ marginTop: 24 }}>
                            Save Post
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default BlogDetail;
