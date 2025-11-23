import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Button,
    Select,
    Table,
    InputNumber,
    Space,
    Divider,
    Typography,
    AutoComplete,
    message,
    Form
} from 'antd';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    UserOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const CreateOrder = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // State for line items
    const [lineItems, setLineItems] = useState([]);
    const [productSearch, setProductSearch] = useState('');

    // State for customer
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Mock Data for Search
    const mockProducts = [
        { value: 'p1', label: 'Jetstream 4&1 Metal Edition - Black', price: 2200, sku: 'UNI-JET-41-BLK', image: 'https://bungu.store/cdn/shop/files/uni-jetstream-4-1-metal-edition-2200-yen-668.jpg?v=1709712345' },
        { value: 'p2', label: 'Mildliner Double-Sided Highlighter - 5 Color Set', price: 550, sku: 'ZEB-MILD-5SET', image: 'https://bungu.store/cdn/shop/products/zebra-mildliner-double-sided-highlighter-5-color-set-550-yen.jpg?v=1623300000' },
        { value: 'p3', label: 'Kokuyo Campus Notebook - B5', price: 180, sku: 'KOK-CAMP-B5', image: '' },
    ];

    const mockCustomers = [
        { value: 'c1', label: 'John Doe (john@example.com)', email: 'john@example.com', name: 'John Doe', address: { address1: '1-2-3 Shibuya', city: 'Tokyo', country: 'Japan' } },
        { value: 'c2', label: 'Jane Smith (jane@example.com)', email: 'jane@example.com', name: 'Jane Smith', address: { address1: '456 Oak St', city: 'New York', country: 'USA' } },
    ];

    // Handlers
    const handleProductSelect = (value, option) => {
        const newItem = {
            key: option.value,
            id: option.value,
            name: option.label,
            price: option.price,
            quantity: 1,
            total: option.price,
            sku: option.sku
        };

        // Check if item already exists
        const existingItem = lineItems.find(item => item.id === newItem.id);
        if (existingItem) {
            handleQuantityChange(existingItem.id, existingItem.quantity + 1);
        } else {
            setLineItems([...lineItems, newItem]);
        }
        setProductSearch('');
    };

    const handleQuantityChange = (id, quantity) => {
        setLineItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity, total: item.price * quantity };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id) => {
        setLineItems(prev => prev.filter(item => item.id !== id));
    };

    const handleCustomerSelect = (value, option) => {
        setSelectedCustomer(option);
        form.setFieldsValue({
            email: option.email,
            shippingAddress: {
                name: option.name,
                address1: option.address.address1,
                city: option.address.city,
                country: option.address.country
            }
        });
    };

    // Calculations
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const shipping = 500; // Flat rate
    const total = subtotal + tax + shipping;

    const onFinish = (values) => {
        setLoading(true);
        console.log('Order Values:', { ...values, lineItems, totals: { subtotal, tax, shipping, total } });

        setTimeout(() => {
            setLoading(false);
            message.success('Order created successfully');
            navigate('/admin/orders');
        }, 1000);
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>SKU: {record.sku}</div>
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `¥${price.toLocaleString()}`
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty, record) => (
                <InputNumber
                    min={1}
                    value={qty}
                    onChange={(val) => handleQuantityChange(record.id, val)}
                />
            )
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `¥${total.toLocaleString()}`
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                />
            )
        }
    ];

    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            <PageHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/orders')} />
                    <Title level={2} style={{ margin: 0 }}>Create Order</Title>
                </div>
                <Space>
                    <Button>Discard</Button>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={lineItems.length === 0}>
                        Create Order
                    </Button>
                </Space>
            </PageHeader>

            <Row gutter={24}>
                <Col span={16}>
                    {/* Products Section */}
                    <StyledCard title="Products">
                        <div style={{ marginBottom: 16 }}>
                            <AutoComplete
                                style={{ width: '100%' }}
                                options={mockProducts}
                                onSelect={handleProductSelect}
                                filterOption={(inputValue, option) =>
                                    option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            >
                                <Input
                                    size="large"
                                    placeholder="Search products..."
                                    prefix={<SearchOutlined />}
                                />
                            </AutoComplete>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={lineItems}
                            pagination={false}
                            rowKey="id"
                            locale={{ emptyText: 'No products added' }}
                        />

                        {lineItems.length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <Row justify="end">
                                    <Col span={10}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text>Subtotal</Text>
                                            <Text>¥{subtotal.toLocaleString()}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text>Shipping</Text>
                                            <Text>¥{shipping.toLocaleString()}</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text>Tax (10%)</Text>
                                            <Text>¥{tax.toLocaleString()}</Text>
                                        </div>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            <Text strong>Total</Text>
                                            <Text strong>¥{total.toLocaleString()}</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </StyledCard>

                    {/* Payment Section */}
                    <StyledCard title="Payment">
                        <Form.Item name="paymentStatus" label="Payment Status" initialValue="Pending">
                            <Select>
                                <Option value="Pending">Pending</Option>
                                <Option value="Paid">Paid</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="paymentMethod" label="Payment Method" initialValue="Manual">
                            <Select>
                                <Option value="Manual">Manual</Option>
                                <Option value="Credit Card">Credit Card</Option>
                                <Option value="Bank Transfer">Bank Transfer</Option>
                                <Option value="COD">Cash on Delivery</Option>
                            </Select>
                        </Form.Item>
                    </StyledCard>

                    {/* Notes */}
                    <StyledCard title="Notes">
                        <Form.Item name="note" label="Internal Note">
                            <TextArea rows={4} placeholder="Add a note for this order..." />
                        </Form.Item>
                    </StyledCard>
                </Col>

                <Col span={8}>
                    {/* Customer Section */}
                    <StyledCard title="Customer">
                        <div style={{ marginBottom: 16 }}>
                            <AutoComplete
                                style={{ width: '100%' }}
                                options={mockCustomers}
                                onSelect={handleCustomerSelect}
                                filterOption={(inputValue, option) =>
                                    option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Search or create customer"
                                />
                            </AutoComplete>
                        </div>

                        {selectedCustomer && (
                            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
                                <div style={{ fontWeight: 500 }}>{selectedCustomer.name}</div>
                                <div style={{ color: '#666' }}>{selectedCustomer.email}</div>
                            </div>
                        )}

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Email is required' }]}
                        >
                            <Input placeholder="Email address" />
                        </Form.Item>
                    </StyledCard>

                    {/* Shipping Address */}
                    <StyledCard title="Shipping Address">
                        <Form.Item name={['shippingAddress', 'country']} label="Country/Region" initialValue="Japan">
                            <Select>
                                <Option value="Japan">Japan</Option>
                                <Option value="USA">United States</Option>
                                <Option value="Vietnam">Vietnam</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={['shippingAddress', 'name']} label="Full Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name={['shippingAddress', 'address1']} label="Address">
                            <Input placeholder="Address Line 1" />
                        </Form.Item>
                        <Form.Item name={['shippingAddress', 'city']} label="City">
                            <Input />
                        </Form.Item>
                        <Form.Item name={['shippingAddress', 'zip']} label="Postal Code">
                            <Input />
                        </Form.Item>
                    </StyledCard>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateOrder;
