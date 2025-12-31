import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Tag, Button, Rate, Typography } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSettings } from '../../context/SettingsContext';

const { Text } = Typography;

// Styled Components
const StyledCard = styled(Card)`
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-4px);
  }
  
  .ant-card-body {
    padding: 16px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 4/5;
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

const BadgeContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
`;

const StyledTag = styled(Tag)`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  padding: 2px 8px;
`;

const QuickActionsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateY(100%);
  transition: transform ${props => props.theme.transitions.normal};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
  
  ${ImageContainer}:hover & {
    transform: translateY(0);
  }
`;

const StyledButton = styled(Button)`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    color: ${props => props.theme.colors.primary} !important;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const BrandText = styled(Text)`
  font-size: ${props => props.theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
  display: block;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProductName = styled(Link)`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  display: block;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewCount = styled(Text)`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 4px;
`;

const PriceContainer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Price = styled(Text)`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
`;

const OriginalPrice = styled(Text)`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: line-through;
`;

const MobileButton = styled(Link)`
  display: block;
  margin-top: 12px;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
  
  button {
    width: 100%;
    background-color: ${props => props.theme.colors.gray900};
    color: white;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    border: none;
    
    &:hover {
      background-color: ${props => props.theme.colors.gray800} !important;
      color: white !important;
    }
  }
`;

const ProductCard = ({ product }) => {
  const { formatCurrency } = useSettings();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col">
      <StyledCard
        hoverable
        cover={
          <ImageContainer>
            <img
              src={product.images[0]}
              alt={product.name}
            />

            {/* Badges */}
            <BadgeContainer>
              {product.isNew && (
                <StyledTag color="blue">NEW</StyledTag>
              )}
              {product.isBestSeller && (
                <StyledTag color="gold">BESTSELLER</StyledTag>
              )}
              {discount > 0 && (
                <StyledTag color="red">-{discount}%</StyledTag>
              )}
              {product.stock < 20 && product.stock > 0 && (
                <StyledTag color="orange">LOW STOCK</StyledTag>
              )}
            </BadgeContainer>

            {/* Quick Actions Overlay (Desktop) */}
            <QuickActionsOverlay>
              <StyledButton
                type="text"
                icon={<EyeOutlined />}
              >
                Quick View
              </StyledButton>
              <Link to={`/product/${product._id}`}>
                <StyledButton
                  type="text"
                  icon={<ShoppingCartOutlined />}
                >
                  Options
                </StyledButton>
              </Link>
            </QuickActionsOverlay>
          </ImageContainer>
        }
        bordered={false}
      >
        <ProductInfo>
          {product.brand && (
            <BrandText type="secondary">
              {product.brand}
            </BrandText>
          )}
          <ProductName to={`/product/${product._id}`}>
            {product.name}
          </ProductName>

          <RatingContainer>
            <Rate
              disabled
              defaultValue={product.rating || 0}
              style={{ fontSize: 12 }}
            />
            <ReviewCount type="secondary">
              ({product.reviewCount || 0})
            </ReviewCount>
          </RatingContainer>

          <PriceContainer>
            <Price strong>
              {formatCurrency(product.price)}
            </Price>
            {product.originalPrice && (
              <OriginalPrice delete type="secondary">
                {formatCurrency(product.originalPrice)}
              </OriginalPrice>
            )}
          </PriceContainer>
        </ProductInfo>

        {/* Mobile Action Button */}
        <MobileButton to={`/product/${product._id}`}>
          <Button>
            Choose Options
          </Button>
        </MobileButton>
      </StyledCard>
    </div>
  );
};

export default ProductCard;
