import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Row, Col, Typography, Space } from 'antd';
import {
    EditOutlined,
    BookOutlined,
    ShopOutlined,
    BgColorsOutlined,
    HomeOutlined,
    GiftOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Styled Components
const Section = styled.section`
  padding: 64px 0;
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 64px 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 80px 32px;
  }
`;

const SectionTitle = styled(Title)`
  && {
    text-align: center;
    margin-bottom: 32px;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const CategoryCard = styled(Card)`
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-4px);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const IconWrapper = styled.div`
  font-size: 32px;
  color: ${props => props.theme.colors.gray400};
  margin-bottom: 12px;
  transition: color ${props => props.theme.transitions.fast};
  
  ${CategoryCard}:hover & {
    color: ${props => props.theme.colors.primary};
  }
`;

const BlogCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-4px);
  }
`;

const BlogImage = styled.div`
  aspect-ratio: 16/9;
  background-color: ${props => props.theme.colors.gray200};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${props => props.theme.transitions.slow};
  }
  
  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

const BlogCategory = styled(Text)`
  && {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.xs};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
`;

const BlogTitle = styled(Title)`
  && {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    margin: 8px 0;
    transition: color ${props => props.theme.transitions.fast};
    
    ${BlogCard}:hover & {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const BrandsSection = styled.section`
  padding: 64px 0;
  background-color: ${props => props.theme.colors.gray50};
`;

const BrandsContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const BrandsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
  opacity: 0.6;
  transition: opacity ${props => props.theme.transitions.slow};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    gap: 64px;
  }
  
  &:hover {
    opacity: 1;
  }
`;

const BrandText = styled(Text)`
  && {
    font-size: 1.25rem;
    font-weight: ${props => props.theme.typography.fontWeight.black};
    color: ${props => props.theme.colors.gray400};
    cursor: pointer;
    transition: color ${props => props.theme.transitions.fast};
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 1.5rem;
    }
    
    &:hover {
      color: ${props => props.theme.colors.gray900};
    }
  }
`;

const categories = [
    { name: 'Writing', icon: EditOutlined },
    { name: 'Paper', icon: BookOutlined },
    { name: 'Office', icon: ShopOutlined },
    { name: 'Art Supplies', icon: BgColorsOutlined },
    { name: 'Home Goods', icon: HomeOutlined },
    { name: 'Toys', icon: GiftOutlined },
];

const brands = [
    'Midori', 'Tombow', 'Pilot', 'Studio Ghibli', 'Kokuyo', 'Zebra'
];

const AdditionalSections = () => {
    return (
        <>
            {/* Shop by Category */}
            <Section>
                <SectionTitle level={2}>Shop by Category</SectionTitle>
                <Row gutter={[16, 16]} justify="center">
                    {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                            <Col xs={12} sm={8} md={6} lg={4} key={cat.name}>
                                <Link to={`/shop?category=${cat.name}`}>
                                    <CategoryCard hoverable>
                                        <Space direction="vertical" align="center" size="middle">
                                            <IconWrapper>
                                                <IconComponent />
                                            </IconWrapper>
                                            <Text strong>{cat.name}</Text>
                                        </Space>
                                    </CategoryCard>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Section>

            {/* From Our Reads */}
            <Section style={{ backgroundColor: 'white', borderTop: '1px solid #f3f4f6' }}>
                <SectionTitle level={2}>From Our Reads</SectionTitle>
                <Row gutter={[32, 32]}>
                    {[1, 2, 3].map((i) => (
                        <Col xs={24} md={8} key={i}>
                            <BlogCard hoverable>
                                <BlogImage>
                                    <img
                                        src={`https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80`}
                                        alt="Blog post"
                                    />
                                </BlogImage>
                                <div style={{ padding: '24px' }}>
                                    <BlogCategory>Journal</BlogCategory>
                                    <BlogTitle level={4}>
                                        The Art of Japanese Stationery: A Deep Dive into Paper Quality
                                    </BlogTitle>
                                    <Paragraph type="secondary" style={{ fontSize: 14 }}>
                                        Discover why Japanese paper is revered by artists and writers around the world...
                                    </Paragraph>
                                </div>
                            </BlogCard>
                        </Col>
                    ))}
                </Row>
            </Section>

            {/* Brands We Love */}
            <BrandsSection>
                <BrandsContainer>
                    <SectionTitle level={2}>Brands We Love</SectionTitle>
                    <BrandsGrid>
                        {brands.map((brand) => (
                            <BrandText key={brand}>
                                {brand.toUpperCase()}
                            </BrandText>
                        ))}
                    </BrandsGrid>
                </BrandsContainer>
            </BrandsSection>
        </>
    );
};

export default AdditionalSections;
