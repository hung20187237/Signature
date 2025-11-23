import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    ShoppingOutlined,
    UserOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    TagsOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #001529;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/admin/orders',
            icon: <FileTextOutlined />,
            label: 'Orders',
        },
        {
            key: '/admin/customers',
            icon: <UserOutlined />,
            label: 'Customers',
        },
        {
            key: '/admin/collections',
            icon: <AppstoreOutlined />,
            label: 'Collections',
        },
        {
            key: '/admin/content',
            icon: <TagsOutlined />,
            label: 'Content',
            children: [
                { key: '/admin/content/banners', label: 'Banners' },
                { key: '/admin/content/blog', label: 'Blog Posts' },
            ],
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            // Clear user info and redirect to login
            localStorage.removeItem('userInfo');
            navigate('/login');
        } else if (key === 'profile') {
            navigate('/admin/profile');
        } else if (key === 'settings') {
            navigate('/admin/settings');
        }
    };

    return (
        <StyledLayout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <LogoContainer>
                    {collapsed ? 'BS' : 'Bungu Admin'}
                </LogoContainer>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/admin']}
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <StyledHeader style={{ background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <HeaderRight>
                        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Avatar icon={<UserOutlined />} />
                                <span>Admin User</span>
                            </div>
                        </Dropdown>
                    </HeaderRight>
                </StyledHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </StyledLayout>
    );
};

export default AdminLayout;
