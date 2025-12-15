import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Descriptions, Table, Tag, Button, Input, List, Typography, Divider, message, Spin, Form, Checkbox, Select, Statistic, Space } from 'antd';
import { UserOutlined, ShoppingOutlined, DollarOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import dayjs from 'dayjs';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DetailContainer = styled.div`
  padding: 0;
`;

const SectionCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const CustomerDetail = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();
    const [note, setNote] = useState('');

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/users/${id}`);
            setCustomer(data);
            form.setFieldsValue({
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                isGuest: data.isGuest,
                acceptsMarketing: data.acceptsMarketing,
                tags: data.tags || []
            });
        } catch (error) {
            message.error('Failed to fetch customer details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        try {
            const { data } = await axios.put(`/api/users/${id}`, values);
            setCustomer({ ...customer, ...data });
            setEditing(false);
            message.success('Customer updated successfully');
        } catch (error) {
            message.error('Failed to update customer');
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        try {
            const { data } = await axios.post(`/api/users/${id}/notes`, { content: note });
            // Backend returns array of notes with mapped fields
            setCustomer({ ...customer, notes: data });
            setNote('');
            message.success('Note added');
        } catch (error) {
            message.error('Failed to add note');
        }
    };

    const orderColumns = [
        {
            title: 'Order #',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a href={`/admin/orders/${text}`}>#{text}</a>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <span>
                    <Tag color={record.paymentStatus === 'Paid' ? 'success' : 'warning'}>{record.paymentStatus}</Tag>
                    <Tag color={record.fulfillmentStatus === 'Fulfilled' ? 'success' : 'default'}>{record.fulfillmentStatus}</Tag>
                </span>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (val) => `¥${parseFloat(val || 0).toLocaleString()}`,
        },
    ];

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    if (!customer) return <div>Customer not found</div>;

    return (
        <DetailContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>{customer.name}</Title>
                    <Text type="secondary">{customer.email}</Text>
                    <div style={{ marginTop: 8 }}>
                        <Tag color={customer.isGuest ? 'orange' : 'green'}>{customer.isGuest ? 'Guest' : 'Registered'}</Tag>
                        {customer.acceptsMarketing && <Tag color="blue">Subscribed</Tag>}
                    </div>
                </div>
                <Space>
                    <Button type="primary" onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </Space>
            </div>

            <Row gutter={24}>
                {/* Left Column: Overview & Orders */}
                <Col xs={24} lg={16}>
                    <SectionCard title="Overview">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title="Total Orders" value={customer.totalOrders} prefix={<ShoppingOutlined />} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Total Spent" value={customer.totalSpent} prefix={<DollarOutlined />} precision={2} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="AOV" value={customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0} prefix={<DollarOutlined />} precision={2} />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16 }}>
                            <Text type="secondary">Customer since: {dayjs(customer.createdAt).format('MMMM D, YYYY')}</Text>
                            <br />
                            <Text type="secondary">Last order: {customer.lastOrderAt ? dayjs(customer.lastOrderAt).format('MMMM D, YYYY') : 'N/A'}</Text>
                        </div>
                    </SectionCard>

                    <SectionCard title="Orders History">
                        <Table
                            columns={orderColumns}
                            dataSource={customer.orders}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </SectionCard>
                </Col>

                {/* Right Column: Profile, Addresses, Notes */}
                <Col xs={24} lg={8}>
                    <SectionCard title="Customer Profile">
                        {editing ? (
                            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="tags" label="Tags">
                                    <Select mode="tags" placeholder="Add tags" />
                                </Form.Item>
                                <Form.Item name="acceptsMarketing" valuePropName="checked">
                                    <Checkbox>Accepts Marketing</Checkbox>
                                </Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save Changes</Button>
                            </Form>
                        ) : (
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
                                <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
                                <Descriptions.Item label="Phone">{customer.phone || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Tags">
                                    {customer.tags && customer.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </SectionCard>

                    <SectionCard title="Addresses">
                        {customer.addresses && customer.addresses.length > 0 ? (
                            <List
                                dataSource={customer.addresses}
                                renderItem={addr => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={`${addr.address1} ${addr.address2 || ''}`}
                                            description={`${addr.city}, ${addr.country}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">No addresses saved.</Text>
                        )}
                    </SectionCard>

                    <SectionCard title="Notes">
                        <div style={{ marginBottom: 16 }}>
                            <TextArea
                                rows={2}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Add a note..."
                            />
                            <Button type="dashed" onClick={handleAddNote} style={{ marginTop: 8 }} block>Add Note</Button>
                        </div>
                        <List
                            itemLayout="horizontal"
                            dataSource={customer.notes || []}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.date).format('YYYY-MM-DD HH:mm')} by {item.author}</Text>}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </SectionCard>
                </Col>
            </Row>
        </DetailContainer>
    );
};

export default CustomerDetail;
