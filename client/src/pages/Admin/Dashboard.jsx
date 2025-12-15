import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Spin, message, Select, Badge, Alert } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;

const DashboardContainer = styled.div`
  padding: 0;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  height: 100%;
  
  .ant-card-body {
    padding: 20px 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ChartContainer = styled.div`
  height: 350px;
  width: 100%;
  margin-top: 20px;
`;

const KPICard = ({ title, value, prefix, suffix, change, loading, formatter }) => {
    const isPositive = change >= 0;
    const color = isPositive ? '#3f8600' : '#cf1322';
    const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;

    return (
        <StyledCard>
            <Statistic
                title={title}
                value={value}
                precision={0}
                valueStyle={{ color: isPositive ? '#3f8600' : '#000000' }}
                prefix={prefix}
                suffix={suffix}
                loading={loading}
                formatter={formatter}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666', display: 'flex', alignItems: 'center' }}>
                <span style={{ color, marginRight: 4, display: 'flex', alignItems: 'center' }}>
                    <Icon /> {Math.abs(change)}%
                </span>
                <span>vs previous period</span>
            </div>
        </StyledCard>
    );
};

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('last_30_days');
    const [data, setData] = useState({
        summary: {
            total_revenue: { value: 0, change: 0 },
            total_orders: { value: 0, change: 0 },
            average_order_value: { value: 0, change: 0 },
            new_customers: { value: 0, change: 0 }
        },
        revenue_chart: [],
        top_products: [],
        recent_orders: [],
        alerts: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, [range]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/dashboard?range=${range}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const recentOrderColumns = [
        {
            title: 'Order #',
            dataIndex: 'order_number',
            key: 'order_number',
            render: (text, record) => <a href={`/admin/orders/${record.order_id}`}>{text}</a>,
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (val) => `¥${(val || 0).toLocaleString()}`,
        },
        {
            title: 'Payment',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (status) => {
                let color = 'default';
                if (status === 'Paid') color = 'success';
                if (status === 'Pending') color = 'warning';
                if (status === 'Failed') color = 'error';
                return <Badge status={color} text={status} />;
            }
        },
        {
            title: 'Fulfillment',
            dataIndex: 'fulfillment_status',
            key: 'fulfillment_status',
            render: (status) => {
                let color = 'default';
                if (status === 'Fulfilled') color = 'success';
                if (status === 'Unfulfilled') color = 'warning';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        }
    ];

    const topProductColumns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            align: 'right',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
            align: 'right',
            render: (val) => `¥${(val || 0).toLocaleString()}`,
        },
    ];

    if (loading && !data.summary.total_revenue.value) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <DashboardContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
                <Select defaultValue="last_30_days" style={{ width: 180 }} onChange={setRange}>
                    <Option value="today">Today</Option>
                    <Option value="last_7_days">Last 7 Days</Option>
                    <Option value="last_30_days">Last 30 Days</Option>
                    <Option value="last_90_days">Last 90 Days</Option>
                </Select>
            </div>

            {/* Alerts */}
            {data.alerts && data.alerts.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    {data.alerts.map((alert, index) => (
                        <Alert
                            key={index}
                            message={alert.message}
                            type={alert.type === 'low_stock' ? 'warning' : 'info'}
                            showIcon
                            style={{ marginBottom: 8 }}
                        />
                    ))}
                </div>
            )}

            {/* KPI Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <KPICard
                        title="Total Revenue"
                        value={data.summary.total_revenue.value}
                        change={data.summary.total_revenue.change}
                        prefix={<DollarOutlined />}
                        formatter={(value) => `¥${value.toLocaleString()}`}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KPICard
                        title="Total Orders"
                        value={data.summary.total_orders.value}
                        change={data.summary.total_orders.change}
                        prefix={<FileTextOutlined />}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KPICard
                        title="Average Order Value"
                        value={data.summary.average_order_value.value}
                        change={data.summary.average_order_value.change}
                        prefix={<ShoppingOutlined />}
                        formatter={(value) => `¥${Math.round(value).toLocaleString()}`}
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <KPICard
                        title="New Customers"
                        value={data.summary.new_customers.value}
                        change={data.summary.new_customers.change}
                        prefix={<UserOutlined />}
                        loading={loading}
                    />
                </Col>
            </Row>

            {/* Revenue Chart */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <StyledCard title="Revenue Trend">
                        <ChartContainer>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={data.revenue_chart}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => dayjs(str).format('MMM D')}
                                    />
                                    <YAxis tickFormatter={(val) => `¥${val / 1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip
                                        formatter={(value) => [`¥${value.toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => dayjs(label).format('MMMM D, YYYY')}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#1890ff"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </StyledCard>
                </Col>
            </Row>

            {/* Top Products & Recent Orders */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={10}>
                    <StyledCard title="Top Products">
                        <Table
                            columns={topProductColumns}
                            dataSource={data.top_products}
                            rowKey="product_id"
                            pagination={false}
                            size="small"
                        />
                    </StyledCard>
                </Col>
                <Col xs={24} lg={14}>
                    <StyledCard title="Recent Orders" extra={<a href="/admin/orders">View All</a>}>
                        <Table
                            columns={recentOrderColumns}
                            dataSource={data.recent_orders}
                            rowKey="order_id"
                            pagination={false}
                            size="small"
                        />
                    </StyledCard>
                </Col>
            </Row>
        </DashboardContainer>
    );
};

export default Dashboard;
