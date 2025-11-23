import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, UserOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 0;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  
  .ant-card-body {
    padding: 20px 24px;
  }
`;

const RecentOrdersTable = () => {
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>#{text}</a>,
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let color = 'green';
                if (status === 'Pending') color = 'gold';
                if (status === 'Processing') color = 'blue';
                if (status === 'Cancelled') color = 'red';
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
    ];

    const data = [
        {
            key: '1',
            id: '1001',
            customer: 'John Brown',
            status: 'Processing',
            total: '¥5,400',
        },
        {
            key: '2',
            id: '1002',
            customer: 'Jim Green',
            status: 'Pending',
            total: '¥12,300',
        },
        {
            key: '3',
            id: '1003',
            customer: 'Joe Black',
            status: 'Completed',
            total: '¥3,200',
        },
        {
            key: '4',
            id: '1004',
            customer: 'Jim Red',
            status: 'Cancelled',
            total: '¥8,900',
        },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
};

const Dashboard = () => {
    return (
        <DashboardContainer>
            <h2 style={{ marginBottom: '24px' }}>Dashboard Overview</h2>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Total Sales"
                            value={112893}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            suffix="¥"
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <ArrowUpOutlined style={{ color: '#3f8600' }} /> 12% vs last month
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Orders"
                            value={93}
                            valueStyle={{ color: '#1677ff' }}
                            prefix={<FileTextOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <ArrowUpOutlined style={{ color: '#1677ff' }} /> 5% vs last month
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Products"
                            value={456}
                            prefix={<ShoppingOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <span style={{ color: '#faad14' }}>12</span> Low stock
                        </div>
                    </StyledCard>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StyledCard>
                        <Statistic
                            title="Customers"
                            value={1205}
                            prefix={<UserOutlined />}
                        />
                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                            <ArrowUpOutlined style={{ color: '#3f8600' }} /> 8% new this month
                        </div>
                    </StyledCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={16}>
                    <StyledCard title="Recent Orders" extra={<a href="#">View All</a>}>
                        <RecentOrdersTable />
                    </StyledCard>
                </Col>
                <Col xs={24} lg={8}>
                    <StyledCard title="Top Products">
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={{ marginBottom: '12px' }}>Jetstream 4&1 (Black) - 42 sold</li>
                            <li style={{ marginBottom: '12px' }}>Mildliner Set 5 - 38 sold</li>
                            <li style={{ marginBottom: '12px' }}>Kokuyo Campus Notebook - 35 sold</li>
                            <li style={{ marginBottom: '12px' }}>Uni Kuru Toga - 29 sold</li>
                            <li>Midori MD Notebook - 25 sold</li>
                        </ul>
                    </StyledCard>
                </Col>
            </Row>
        </DashboardContainer>
    );
};

export default Dashboard;
