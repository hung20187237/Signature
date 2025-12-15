import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Divider,
    List,
    Avatar,
    Steps,
    Typography,
    message,
    Input,
    Modal,
    Table
} from 'antd';
import {
    ArrowLeftOutlined,
    PrinterOutlined,
    CheckCircleOutlined,
    CarOutlined,
    UserOutlined,
    CreditCardOutlined,
    DollarOutlined,
    FileTextOutlined,
    CopyOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
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

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
`;

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [note, setNote] = useState('');

    // Mock data
    const mockOrder = {
        id: id,
        createdAt: '2023-11-20T10:30:00Z',
        orderStatus: 'Confirmed',
        paymentStatus: 'Paid',
        fulfillmentStatus: 'Unfulfilled',
        User: {
            name: 'John Doe',
            email: 'john@example.com',
        },
        shippingAddress: {
            name: 'John Doe',
            address1: '1-2-3 Shibuya',
            address2: 'Building A, Apt 101',
            city: 'Shibuya-ku',
            province: 'Tokyo',
            zip: '150-0001',
            country: 'Japan',
            countryCode: 'JP',
            phone: '+81 90-1234-5678'
        },
        billingAddress: {
            name: 'John Doe',
            address1: '1-2-3 Shibuya',
            address2: 'Building A, Apt 101',
            city: 'Shibuya-ku',
            province: 'Tokyo',
            zip: '150-0001',
            country: 'Japan'
        },
        orderItems: [
            {
                id: 'p1',
                name: 'Jetstream 4&1 Metal Edition',
                variant: 'Black',
                sku: 'UNI-JET-41-BLK',
                price: 2200,
                qty: 1,
                image: 'https://bungu.store/cdn/shop/files/uni-jetstream-4-1-metal-edition-2200-yen-668.jpg?v=1709712345'
            },
            {
                id: 'p2',
                name: 'Mildliner Double-Sided Highlighter',
                variant: '5 Color Set',
                sku: 'ZEB-MILD-5SET',
                price: 550,
                qty: 2,
                image: 'https://bungu.store/cdn/shop/products/zebra-mildliner-double-sided-highlighter-5-color-set-550-yen.jpg?v=1623300000'
            }
        ],
        itemsPrice: 3300,
        shippingPrice: 500,
        taxPrice: 330,
        totalPrice: 4130,
        transactions: [
            {
                id: 'pi_1234567890',
                provider: 'Stripe',
                amount: 4130,
                status: 'Captured',
                date: '2023-11-20T10:30:05Z'
            }
        ],
        shipments: [],
        refunds: [],
        timeline: [
            { date: '2023-11-20T10:30:00Z', text: 'Order placed by John Doe' },
            { date: '2023-11-20T10:30:05Z', text: 'Payment of ¥4,130 verified via Stripe' },
            { date: '2023-11-20T10:30:05Z', text: 'Confirmation email sent to john@example.com' }
        ]
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setOrder(mockOrder);
            setLoading(false);
        }, 500);
    }, [id]);

    const handleFulfill = () => {
        Modal.confirm({
            title: 'Create Fulfillment',
            content: (
                <div>
                    <p>Marking items as fulfilled and sending shipment notification.</p>
                    <Input placeholder="Tracking Number (Optional)" style={{ marginTop: 8 }} />
                    <Input placeholder="Carrier (e.g. JP Post)" style={{ marginTop: 8 }} />
                </div>
            ),
            onOk: () => {
                message.success('Fulfillment created successfully');
                setOrder(prev => ({
                    ...prev,
                    fulfillmentStatus: 'Fulfilled',
                    shipments: [
                        {
                            id: 'SH-1001',
                            carrier: 'JP Post',
                            tracking: 'JP1234567890',
                            date: new Date().toISOString(),
                            items: prev.items
                        }
                    ],
                    timeline: [
                        { date: new Date().toISOString(), text: 'Shipment #SH-1001 created (JP Post)' },
                        ...prev.timeline
                    ]
                }));
            }
        });
    };

    const handleRefund = () => {
        Modal.confirm({
            title: 'Create Refund',
            content: 'Are you sure you want to refund this order?',
            onOk: () => {
                message.success('Refund processed');
                setOrder(prev => ({
                    ...prev,
                    paymentStatus: 'Refunded',
                    refunds: [
                        {
                            id: 'R-0001',
                            amount: 1000,
                            reason: 'Customer returned item',
                            date: new Date().toISOString()
                        }
                    ],
                    timeline: [
                        { date: new Date().toISOString(), text: 'Refund #R-0001 created (¥1,000)' },
                        ...prev.timeline
                    ]
                }));
            }
        });
    };

    const handleAddNote = () => {
        if (!note.trim()) return;
        message.success('Note added');
        setOrder(prev => ({
            ...prev,
            timeline: [
                { date: new Date().toISOString(), text: `Note: ${note}` },
                ...prev.timeline
            ]
        }));
        setNote('');
    };

    if (loading || !order) return <div>Loading...</div>;

    return (
        <div>
            <PageHeader>
                <HeaderTitle>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/orders')} style={{ marginRight: 16 }} />
                    <div>
                        <h1>Order #{order.id}</h1>
                        <Space size="small" style={{ marginTop: 4 }}>
                            <Text type="secondary">{dayjs(order.createdAt).format('MMMM D, YYYY [at] h:mm A')}</Text>
                            <Tag color={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>{order.paymentStatus}</Tag>
                            <Tag color={order.fulfillmentStatus === 'Fulfilled' ? 'success' : 'warning'}>{order.fulfillmentStatus}</Tag>
                            <Tag color="cyan">{order.orderStatus}</Tag>
                        </Space>
                    </div>
                </HeaderTitle>
                <Space>
                    <Button icon={<PrinterOutlined />}>Print</Button>
                    <Button onClick={handleRefund}>Refund</Button>
                    <Button type="primary" onClick={handleFulfill} disabled={order.fulfillmentStatus === 'Fulfilled'}>
                        Fulfill Items
                    </Button>
                </Space>
            </PageHeader>

            <Row gutter={24}>
                <Col span={16}>
                    {/* Order Items */}
                    <StyledCard title="Order Items">
                        <List
                            itemLayout="horizontal"
                            dataSource={order.orderItems || []}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<ItemImage src={item.image} alt={item.name} />}
                                        title={<span style={{ fontWeight: 500 }}>{item.name}</span>}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">{item.variant}</Text>
                                                <Text type="secondary">SKU: {item.sku}</Text>
                                            </Space>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        <div>¥{(item.price || 0).toLocaleString()} x {item.qty || item.quantity || 1}</div>
                                        <div style={{ fontWeight: 500 }}>¥{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Divider />
                        <Row justify="end">
                            <Col span={10}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Subtotal</Text>
                                    <Text>¥{(order.itemsPrice || 0).toLocaleString()}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Shipping</Text>
                                    <Text>¥{(order.shippingPrice || 0).toLocaleString()}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text>Tax</Text>
                                    <Text>¥{(order.taxPrice || 0).toLocaleString()}</Text>
                                </div>
                                <Divider style={{ margin: '12px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    <Text strong>Total</Text>
                                    <Text strong>¥{(order.totalPrice || 0).toLocaleString()}</Text>
                                </div>
                            </Col>
                        </Row>
                    </StyledCard>

                    {/* Fulfillment / Shipments */}
                    {order.shipments.length > 0 && (
                        <StyledCard title="Shipments">
                            {order.shipments.map(shipment => (
                                <div key={shipment.id} style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>{shipment.carrier} - {shipment.tracking}</Text>
                                        <Text type="secondary">{dayjs(shipment.date).format('MMM D, YYYY')}</Text>
                                    </div>
                                    <Text type="secondary">Items: {shipment.items.map(i => i.name).join(', ')}</Text>
                                </div>
                            ))}
                        </StyledCard>
                    )}

                    {/* Payments */}
                    <StyledCard title="Payments">
                        <Table
                            dataSource={order.transactions}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: 'Provider', dataIndex: 'provider', key: 'provider' },
                                { title: 'Transaction ID', dataIndex: 'id', key: 'id' },
                                { title: 'Amount', dataIndex: 'amount', key: 'amount', render: val => `¥${val.toLocaleString()}` },
                                { title: 'Status', dataIndex: 'status', key: 'status', render: val => <Tag color="success">{val}</Tag> },
                                { title: 'Date', dataIndex: 'date', key: 'date', render: val => dayjs(val).format('MMM D, h:mm A') },
                            ]}
                        />
                    </StyledCard>

                    {/* Refunds */}
                    {order.refunds.length > 0 && (
                        <StyledCard title="Refunds">
                            <Table
                                dataSource={order.refunds}
                                rowKey="id"
                                pagination={false}
                                columns={[
                                    { title: 'Refund ID', dataIndex: 'id', key: 'id' },
                                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: val => `¥${val.toLocaleString()}` },
                                    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
                                    { title: 'Date', dataIndex: 'date', key: 'date', render: val => dayjs(val).format('MMM D, h:mm A') },
                                ]}
                            />
                        </StyledCard>
                    )}

                    {/* Timeline */}
                    <StyledCard title="Timeline">
                        <Steps direction="vertical" size="small" current={order.timeline.length}>
                            {order.timeline.map((event, index) => (
                                <Step
                                    key={index}
                                    title={event.text}
                                    description={dayjs(event.date).format('MMM D, h:mm A')}
                                    status="finish"
                                    icon={<CheckCircleOutlined />}
                                />
                            ))}
                        </Steps>
                        <Divider />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="Leave a private note..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                onPressEnter={handleAddNote}
                            />
                            <Button onClick={handleAddNote}>Post</Button>
                        </div>
                    </StyledCard>
                </Col>

                <Col span={8}>
                    {/* Customer Info */}
                    <StyledCard
                        title="Customer"
                        extra={<a href="#">View Profile</a>}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: 12 }} />
                            <div>
                                <div style={{ fontWeight: 500 }}>{order.User?.name || 'Guest'}</div>
                                <div style={{ color: '#1890ff' }}>Customer</div>
                            </div>
                        </div>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            <div>
                                <Text strong>Contact Information</Text>
                                <div><a href={`mailto:${order.User?.email}`}>{order.User?.email}</a></div>
                                <div>{order.shippingAddress?.phone}</div>
                            </div>
                            <Divider style={{ margin: '4px 0' }} />
                            <div>
                                <Text strong>Shipping Address</Text>
                                <div>{order.shippingAddress.name}</div>
                                <div>{order.shippingAddress.address1}</div>
                                <div>{order.shippingAddress.address2}</div>
                                <div>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</div>
                                <div>{order.shippingAddress.country} <Tag>{order.shippingAddress.countryCode}</Tag></div>
                            </div>
                            <Divider style={{ margin: '4px 0' }} />
                            <div>
                                <Text strong>Billing Address</Text>
                                <div style={{ color: '#666' }}>Same as shipping address</div>
                            </div>
                        </Space>
                    </StyledCard>

                    {/* Notes */}
                    <StyledCard title="Internal Notes">
                        <Text type="secondary">No notes from customer</Text>
                    </StyledCard>
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetail;
