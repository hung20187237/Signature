import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Breadcrumb from '../components/Layout/Breadcrumb';

const { TextArea } = Input;

const PageContainer = styled.div`
  background: white;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px 96px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 32px 24px 96px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 32px 32px 96px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 64px;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const InfoSection = styled.div`
  background: ${props => props.theme.colors.gray50};
  padding: 40px;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 32px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.25rem;
  box-shadow: ${props => props.theme.shadows.sm};
  flex-shrink: 0;
`;

const InfoContent = styled.div``;

const InfoLabel = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 4px 0;
`;

const InfoText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

const FormSection = styled.div``;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const FormDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label label {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
`;

const SubmitButton = styled(Button)`
  && {
    height: 48px;
    padding: 0 48px;
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const MapContainer = styled.div`
  margin-top: 64px;
  height: 400px;
  background: ${props => props.theme.colors.gray100};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
  
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Contact form values:', values);
            message.success('Thank you for your message. We will get back to you soon!');
            form.resetFields();
        } catch (error) {
            message.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <Container>
                <Breadcrumb />

                <PageHeader>
                    <PageTitle>Contact Us</PageTitle>
                    <PageDescription>
                        Have a question about our products or your order? We're here to help.
                        Fill out the form below or reach out to us directly.
                    </PageDescription>
                </PageHeader>

                <ContentWrapper>
                    <InfoSection>
                        <InfoTitle>Get in Touch</InfoTitle>

                        <InfoItem>
                            <IconWrapper>
                                <EnvironmentOutlined />
                            </IconWrapper>
                            <InfoContent>
                                <InfoLabel>Our Store</InfoLabel>
                                <InfoText>
                                    123 Stationery Lane<br />
                                    Shibuya City, Tokyo 150-0001<br />
                                    Japan
                                </InfoText>
                            </InfoContent>
                        </InfoItem>

                        <InfoItem>
                            <IconWrapper>
                                <MailOutlined />
                            </IconWrapper>
                            <InfoContent>
                                <InfoLabel>Email Us</InfoLabel>
                                <InfoText>
                                    support@bungu.store<br />
                                    wholesale@bungu.store
                                </InfoText>
                            </InfoContent>
                        </InfoItem>

                        <InfoItem>
                            <IconWrapper>
                                <PhoneOutlined />
                            </IconWrapper>
                            <InfoContent>
                                <InfoLabel>Call Us</InfoLabel>
                                <InfoText>
                                    +81 3-1234-5678<br />
                                    Mon - Fri, 10am - 6pm JST
                                </InfoText>
                            </InfoContent>
                        </InfoItem>

                        <InfoItem>
                            <IconWrapper>
                                <ClockCircleOutlined />
                            </IconWrapper>
                            <InfoContent>
                                <InfoLabel>Opening Hours</InfoLabel>
                                <InfoText>
                                    Monday - Friday: 10:00 - 18:00<br />
                                    Saturday: 11:00 - 17:00<br />
                                    Sunday: Closed
                                </InfoText>
                            </InfoContent>
                        </InfoItem>
                    </InfoSection>

                    <FormSection>
                        <FormTitle>Send us a Message</FormTitle>
                        <FormDescription>
                            We typically reply within 24 hours on business days.
                        </FormDescription>

                        <StyledForm
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Name"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input placeholder="Your name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input placeholder="Your email" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="subject"
                                label="Subject"
                                rules={[{ required: true, message: 'Please enter a subject' }]}
                            >
                                <Input placeholder="How can we help?" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[{ required: true, message: 'Please enter your message' }]}
                            >
                                <TextArea rows={6} placeholder="Tell us more about your inquiry..." />
                            </Form.Item>

                            <Form.Item>
                                <SubmitButton type="primary" htmlType="submit" loading={loading}>
                                    Send Message
                                </SubmitButton>
                            </Form.Item>
                        </StyledForm>
                    </FormSection>
                </ContentWrapper>

                <MapContainer>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754683745!2d139.7016358!3d35.6585805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b563b00109f%3A0x337328def1e2ab26!2sShibuya%20Station!5e0!3m2!1sen!2sjp!4v1623300000000!5m2!1sen!2sjp"
                        allowFullScreen=""
                        loading="lazy"
                        title="Store Location"
                    ></iframe>
                </MapContainer>
            </Container>
        </PageContainer>
    );
};

export default ContactUs;
