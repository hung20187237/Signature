import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #6b7280;
`;

const UserRole = styled.span`
  display: inline-block;
  margin-top: 8px;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const AdminProfile = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Get user info from localStorage
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
        setUserInfo(storedUserInfo);

        if (storedUserInfo) {
            form.setFieldsValue({
                name: storedUserInfo.name,
                email: storedUserInfo.email,
            });
        }
    }, [form]);

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            // TODO: Implement actual API call to update profile
            console.log('Update profile:', values);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update localStorage
            const updatedUserInfo = {
                ...userInfo,
                name: values.name,
                email: values.email,
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setUserInfo(updatedUserInfo);

            message.success('Profile updated successfully');
        } catch (error) {
            message.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values) => {
        setLoading(true);
        try {
            // TODO: Implement actual API call to change password
            console.log('Change password');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('Password changed successfully');
            form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
        } catch (error) {
            message.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <PageContainer>
            <ProfileHeader>
                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#3b82f6' }} />
                <UserInfo>
                    <UserName>{userInfo.name}</UserName>
                    <UserEmail>{userInfo.email}</UserEmail>
                    <UserRole>{userInfo.role || 'Admin'}</UserRole>
                </UserInfo>
            </ProfileHeader>

            <Card title="Profile Information" style={{ marginBottom: 24 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input prefix={<UserOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Change Password">
                <Form
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter your new password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageContainer>
    );
};

export default AdminProfile;
