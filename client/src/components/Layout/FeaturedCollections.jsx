import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Card, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Styled Components
const Section = styled.section`
  padding: 64px 16px;
  max-width: 1280px;
  margin: 0 auto;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 64px 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 80px 32px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;

const SectionTitle = styled(Title)`
  && {
    margin: 0;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primary};
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
  
  .anticon {
    margin-left: 4px;
    transition: transform ${props => props.theme.transitions.fast};
  }
  
  &:hover .anticon {
    transform: translateX(4px);
  }
`;

const StyledCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
  width: 100%;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-4px);
  }
  
  .ant-card-body {
    padding: 16px;
  }
`;

const ImageContainer = styled.div`
  aspect-ratio: 3/4;
  width: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.colors.gray100};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform ${props => props.theme.transitions.slow};
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CollectionName = styled(Text)`
  && {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 4px;
    
    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
  }
`;

const ViewCollectionText = styled(Text)`
  && {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.xs};
    color: ${props => props.theme.colors.textSecondary};
    transition: color ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const CardLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`;

const collections = [
  { id: 1, name: '2026 ICHIKUDO Calendars', image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Touch & Flow', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'MIDORI', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Gacha Toy Capsules', image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Studio Ghibli', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80' },
];

const FeaturedCollections = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle level={2}>Featured Collections</SectionTitle>
        <ViewAllLink to="/shop">
          View all <ArrowRightOutlined />
        </ViewAllLink>
      </SectionHeader>

      <Row gutter={[24, 24]}>
        {collections.map((collection) => (
          <Col style={{ flex: 1, maxWidth: 'unset' }} xs={24} sm={12} md={8} lg={6} xl={4} key={collection.id}>
            <CardLink to={`/shop?collection=${collection.name}`}>
              <StyledCard
                hoverable
                cover={
                  <ImageContainer>
                    <img
                      src={collection.image}
                      alt={collection.name}
                    />
                  </ImageContainer>
                }
                bordered={false}
              >
                <CollectionName strong>
                  {collection.name}
                </CollectionName>
                <ViewCollectionText type="secondary">
                  View collection
                </ViewCollectionText>
              </StyledCard>
            </CardLink>
          </Col>
        ))}
      </Row>
    </Section>
  );
};

export default FeaturedCollections;
