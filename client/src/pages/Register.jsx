import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

// Styled Components (reuse from Login)
const PageContainer = styled.div`
  background: white;
  min-height: calc(100vh - 200px);
  padding: 64px 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 80px 24px;
  }
`;

const RegisterContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
  margin: 0 0 32px 0;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.25rem;
    margin: 0 0 40px 0;
  }
`;

const StyledForm = styled(Form)`
  && {
    .ant-form-item {
      margin-bottom: 24px;
    }
    
    .ant-form-item-label {
      padding-bottom: 8px;
      
      label {
        font-size: ${props => props.theme.typography.fontSize.sm};
        font-weight: ${props => props.theme.typography.fontWeight.medium};
        color: ${props => props.theme.colors.textPrimary};
      }
    }
  }
`;

const StyledInput = styled(Input)`
  && {
    padding: 10px 16px;
    font-size: ${props => props.theme.typography.fontSize.sm};
    border-radius: ${props => props.theme.borderRadius.md};
    
    &:focus {
      border-color: ${props => props.theme.colors.textPrimary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.textPrimary}15;
    }
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  && {
    padding: 10px 16px;
    font-size: ${props => props.theme.typography.fontSize.sm};
    border-radius: ${props => props.theme.borderRadius.md};
    
    input {
      padding: 0;
    }
    
    &:focus-within {
      border-color: ${props => props.theme.colors.textPrimary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.textPrimary}15;
    }
  }
`;

const SubmitButton = styled(Button)`
  && {
    width: 100%;
    height: 48px;
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    border-radius: ${props => props.theme.borderRadius.md};
    background-color: ${props => props.theme.colors.textPrimary};
    border-color: ${props => props.theme.colors.textPrimary};
    
    &:hover {
      background-color: ${props => props.theme.colors.textPrimary}dd;
      border-color: ${props => props.theme.colors.textPrimary}dd;
    }
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 32px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.textPrimary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // TODO: Implement actual register API call
      console.log('Register values:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <RegisterContainer>
        <PageTitle>Create Account</PageTitle>

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={handleRegister}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: 'Please enter your first name' }
            ]}
          >
            <StyledInput
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="John"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: 'Please enter your last name' }
            ]}
          >
            <StyledInput
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Doe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <StyledInput
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <SubmitButton
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Create Account
            </SubmitButton>
          </Form.Item>
        </StyledForm>

        <LoginPrompt>
          Already have an account?{' '}
          <LoginLink to="/login">
            Sign in
          </LoginLink>
        </LoginPrompt>
      </RegisterContainer>
    </PageContainer>
  );
};

export default Register;
