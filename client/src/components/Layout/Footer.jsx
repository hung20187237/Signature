import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Row, Col, Typography } from 'antd';
import { InstagramOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

// Styled Components
const StyledFooter = styled(AntFooter)`
  background: white;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 64px 0 32px;
`;

const FooterContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const BrandSection = styled.div`
  margin-bottom: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 0;
  }
`;

const BrandTitle = styled(Title)`
  && {
    font-weight: ${props => props.theme.typography.fontWeight.black};
    letter-spacing: -0.05em;
    margin-bottom: 16px;
    font-size: 1.875rem;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const BrandDescription = styled(Text)`
  && {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.textSecondary};
    max-width: 320px;
    line-height: 1.6;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 0;
  }
`;

const MenuTitle = styled(Title)`
  && {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 20px;
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuLink = styled(Link)`
  display: inline-block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const BottomSection = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
  }
`;

const Copyright = styled(Text)`
  && {
    font-size: ${props => props.theme.typography.fontSize.xs};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const SocialLink = styled.a`
  color: ${props => props.theme.colors.gray400};
  font-size: 20px;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const Footer = () => {
    return (
        <StyledFooter>
            <FooterContainer>
                <Row gutter={[48, 32]}>
                    <Col xs={24} md={8} lg={8}>
                        <BrandSection>
                            <BrandTitle level={3}>
                                SIGNATURE.
                            </BrandTitle>
                            <BrandDescription>
                                Curated Japanese stationery for the modern creative.
                                Bringing the best of Japan's writing instruments to your desk.
                            </BrandDescription>
                        </BrandSection>
                    </Col>

                    <Col xs={12} sm={8} md={5} lg={4}>
                        <MenuSection>
                            <MenuTitle level={5}>
                                Shop
                            </MenuTitle>
                            <MenuList>
                                <li>
                                    <MenuLink to="/shop?category=pens">
                                        Pens
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/shop?category=pencils">
                                        Pencils
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/shop?category=notebooks">
                                        Notebooks
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/shop?category=accessories">
                                        Accessories
                                    </MenuLink>
                                </li>
                            </MenuList>
                        </MenuSection>
                    </Col>

                    <Col xs={12} sm={8} md={5} lg={4}>
                        <MenuSection>
                            <MenuTitle level={5}>
                                Support
                            </MenuTitle>
                            <MenuList>
                                <li>
                                    <MenuLink to="/contact">
                                        Contact Us
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/shipping">
                                        Shipping
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/returns">
                                        Returns
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/faq">
                                        FAQ
                                    </MenuLink>
                                </li>
                            </MenuList>
                        </MenuSection>
                    </Col>

                    <Col xs={12} sm={8} md={6} lg={4}>
                        <MenuSection>
                            <MenuTitle level={5}>
                                Company
                            </MenuTitle>
                            <MenuList>
                                <li>
                                    <MenuLink to="/about">
                                        About Us
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/blog">
                                        Blog
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/careers">
                                        Careers
                                    </MenuLink>
                                </li>
                                <li>
                                    <MenuLink to="/press">
                                        Press
                                    </MenuLink>
                                </li>
                            </MenuList>
                        </MenuSection>
                    </Col>
                </Row>

                <BottomSection>
                    <Copyright>
                        © 2025 Signature Store. All rights reserved.
                    </Copyright>
                    <SocialLinks>
                        <SocialLink href="#" aria-label="Instagram">
                            <InstagramOutlined />
                        </SocialLink>
                        <SocialLink href="#" aria-label="Facebook">
                            <FacebookOutlined />
                        </SocialLink>
                        <SocialLink href="#" aria-label="Twitter">
                            <TwitterOutlined />
                        </SocialLink>
                    </SocialLinks>
                </BottomSection>
            </FooterContainer>
        </StyledFooter>
    );
};

export default Footer;
