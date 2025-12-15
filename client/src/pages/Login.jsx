import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

// Styled Components
const PageContainer = styled.div`
  background: white;
  min-height: calc(100vh - 200px);
  padding: 64px 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 80px 24px;
  }
`;

const LoginContainer = styled.div`
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

const ResetTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
  margin: 0 0 16px 0;
`;

const ResetDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 32px 0;
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

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  display: block;
  
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    text-decoration: underline;
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

const RegisterPrompt = styled.div`
  text-align: center;
  margin-top: 32px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const RegisterLink = styled(Link)`
  color: ${props => props.theme.colors.textPrimary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  padding: 0;
  margin-top: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    text-decoration: underline;
  }
`;

const Login = () => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        message.success('Login successful!');
        if (data.isAdmin || data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        message.error(data.message || 'Login failed');
      }
    } catch (error) {
      message.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      // TODO: Implement actual reset password API call
      console.log('Reset password email:', values.email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Password reset email sent! Please check your inbox.');
      setShowResetPassword(false);
      resetForm.resetFields();
    } catch (error) {
      message.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginContainer>
        {!showResetPassword ? (
          <>
            <PageTitle>Login</PageTitle>

            <StyledForm
              form={loginForm}
              layout="vertical"
              onFinish={handleLogin}
            >
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
                  { required: true, message: 'Please enter your password' }
                ]}
              >
                <StyledPasswordInput
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              <ForgotPasswordLink
                type="button"
                onClick={() => setShowResetPassword(true)}
              >
                Forgot password?
              </ForgotPasswordLink>

              <Form.Item>
                <SubmitButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Sign in
                </SubmitButton>
              </Form.Item>
            </StyledForm>

            <RegisterPrompt>
              New customer?{' '}
              <RegisterLink to="/account/register">
                Create an account
              </RegisterLink>
            </RegisterPrompt>
          </>
        ) : (
          <>
            <ResetTitle>Reset your password</ResetTitle>
            <ResetDescription>
              We will send you an email to reset your password.
            </ResetDescription>

            <StyledForm
              form={resetForm}
              layout="vertical"
              onFinish={handleResetPassword}
            >
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

              <Form.Item>
                <SubmitButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Submit
                </SubmitButton>
              </Form.Item>
            </StyledForm>

            <CancelButton
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                resetForm.resetFields();
              }}
            >
              Cancel
            </CancelButton>
          </>
        )}
      </LoginContainer>
    </PageContainer>
  );
};

export default Login;
