import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Rate, InputNumber, Button, Tabs, Spin } from 'antd';
import { HeartOutlined, TruckOutlined, SafetyOutlined, SyncOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ProductCard from '../components/Product/ProductCard';

const { TabPane } = Tabs;

// Styled Components
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: start;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: 64px;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 24px;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const ThumbnailButton = styled.button`
  position: relative;
  height: 96px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  overflow: hidden;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MainImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  background: ${props => props.theme.colors.gray100};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BrandName = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 8px 0 0 0;
  line-height: 1.2;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.25rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReviewLink = styled.a`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    color: ${props => props.theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Price = styled.p`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const OriginalPrice = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: line-through;
  margin: 0;
`;

const Description = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionGroup = styled.div``;

const OptionLabel = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const OptionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const OptionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$selected ? props.theme.colors.primary + '15' : 'white'};
  color: ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.textPrimary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}15;
  }
`;

const QuantityStockContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const QuantityGroup = styled.div``;

const QuantityLabel = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  width: 128px;
`;

const QuantityButton = styled.button`
  padding: 8px 12px;
  background: white;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.gray100};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  flex: 1;
  text-align: center;
  border: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  
  &:focus {
    outline: none;
  }
`;

const StockIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const StockDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$inStock ? '#10b981' : '#ef4444'};
`;

const StockText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const AddToCartButton = styled(Button)`
  && {
    flex: 1;
    height: 48px;
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

const WishlistButton = styled(Button)`
  && {
    width: 48px;
    height: 48px;
    border-radius: ${props => props.theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ShippingInfo = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  
  .anticon {
    font-size: 18px;
    color: ${props => props.theme.colors.gray400};
  }
`;

const TabsSection = styled.div`
  margin-top: 64px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 48px;
`;

const StyledTabs = styled(Tabs)`
  && {
    .ant-tabs-nav {
      margin-bottom: 32px;
    }
    
    .ant-tabs-tab {
      font-size: ${props => props.theme.typography.fontSize.sm};
      font-weight: ${props => props.theme.typography.fontWeight.medium};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 0;
    }
    
    .ant-tabs-ink-bar {
      background-color: ${props => props.theme.colors.primary};
    }
  }
`;

const TabContent = styled.div`
  max-width: 800px;
  
  p {
    font-size: ${props => props.theme.typography.fontSize.base};
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.7;
    margin-bottom: 16px;
  }
`;

const SpecsGrid = styled.dl`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 600px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SpecItem = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  padding-bottom: 8px;
`;

const SpecLabel = styled.dt`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const SpecValue = styled.dd`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const RelatedSection = styled.div`
  margin-top: 64px;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 32px 0;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    gap: 32px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                setMainImage(data.images[0]);

                // Initialize options
                if (data.options) {
                    const initialOptions = {};
                    data.options.forEach(opt => {
                        initialOptions[opt.name] = opt.values[0];
                    });
                    setSelectedOptions(initialOptions);
                }

                // Fetch related products
                const allProductsRes = await axios.get('http://localhost:5000/api/products');
                const related = allProductsRes.data
                    .filter(p => p.category === data.category && p._id !== data._id)
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'inc' && quantity < (product.stock || 10)) setQuantity(quantity + 1);
    };

    const handleOptionChange = (optionName, value) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    if (loading) {
        return (
            <LoadingContainer>
                <Spin size="large" />
            </LoadingContainer>
        );
    }

    if (!product) {
        return <div style={{ textAlign: 'center', padding: '80px 0' }}>Product not found</div>;
    }

    return (
        <PageContainer>
            <Container>
                <Breadcrumb />

                <ProductGrid>
                    {/* Image Gallery */}
                    <ImageSection>
                        <ThumbnailGrid>
                            {product.images.map((image, index) => (
                                <ThumbnailButton
                                    key={index}
                                    $active={mainImage === image}
                                    onClick={() => setMainImage(image)}
                                >
                                    <img src={image} alt={`Product ${index + 1}`} />
                                </ThumbnailButton>
                            ))}
                        </ThumbnailGrid>

                        <MainImageContainer>
                            <img src={mainImage} alt={product.name} />
                        </MainImageContainer>
                    </ImageSection>

                    {/* Product Info */}
                    <ProductInfo>
                        <div>
                            {product.brand && <BrandName>{product.brand}</BrandName>}
                            <ProductTitle>{product.name}</ProductTitle>
                        </div>

                        <RatingContainer>
                            <Rate disabled defaultValue={product.rating || 0} />
                            <ReviewLink href="#reviews">
                                {product.reviewCount} reviews
                            </ReviewLink>
                        </RatingContainer>

                        <PriceContainer>
                            <Price>${product.price.toFixed(2)}</Price>
                            {product.originalPrice && (
                                <OriginalPrice>${product.originalPrice.toFixed(2)}</OriginalPrice>
                            )}
                        </PriceContainer>

                        <Description>{product.description}</Description>

                        {/* Options */}
                        {product.options && product.options.length > 0 && (
                            <OptionsSection>
                                {product.options.map((option) => (
                                    <OptionGroup key={option.name}>
                                        <OptionLabel>{option.name}</OptionLabel>
                                        <OptionButtons>
                                            {option.values.map((value) => (
                                                <OptionButton
                                                    key={value}
                                                    $selected={selectedOptions[option.name] === value}
                                                    onClick={() => handleOptionChange(option.name, value)}
                                                >
                                                    {value}
                                                </OptionButton>
                                            ))}
                                        </OptionButtons>
                                    </OptionGroup>
                                ))}
                            </OptionsSection>
                        )}

                        {/* Quantity & Stock */}
                        <QuantityStockContainer>
                            <QuantityGroup>
                                <QuantityLabel>Quantity</QuantityLabel>
                                <QuantityControl>
                                    <QuantityButton
                                        onClick={() => handleQuantityChange('dec')}
                                        disabled={quantity <= 1}
                                    >
                                        <MinusOutlined />
                                    </QuantityButton>
                                    <QuantityInput
                                        type="text"
                                        value={quantity}
                                        readOnly
                                    />
                                    <QuantityButton
                                        onClick={() => handleQuantityChange('inc')}
                                        disabled={quantity >= (product.stock || 10)}
                                    >
                                        <PlusOutlined />
                                    </QuantityButton>
                                </QuantityControl>
                            </QuantityGroup>
                        </QuantityStockContainer>

                        <StockIndicator>
                            <StockDot $inStock={product.stock > 0} />
                            <StockText>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </StockText>
                        </StockIndicator>

                        {/* Actions */}
                        <ActionButtons>
                            <AddToCartButton type="primary" size="large">
                                Add to Cart
                            </AddToCartButton>
                            <WishlistButton icon={<HeartOutlined />} />
                        </ActionButtons>

                        {/* Shipping Info */}
                        <ShippingInfo>
                            <InfoItem>
                                <TruckOutlined />
                                <span>Free shipping on orders over $50</span>
                            </InfoItem>
                            <InfoItem>
                                <SafetyOutlined />
                                <span>2-year warranty included</span>
                            </InfoItem>
                            <InfoItem>
                                <SyncOutlined />
                                <span>30-day return policy</span>
                            </InfoItem>
                        </ShippingInfo>
                    </ProductInfo>
                </ProductGrid>

                {/* Tabs Section */}
                <TabsSection>
                    <StyledTabs defaultActiveKey="description">
                        <TabPane tab="Description" key="description">
                            <TabContent>
                                <p>{product.description}</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </TabContent>
                        </TabPane>
                        <TabPane tab="Specs" key="specs">
                            <SpecsGrid>
                                {product.specs ? (
                                    Object.entries(product.specs).map(([key, value]) => (
                                        <SpecItem key={key}>
                                            <SpecLabel>{key}</SpecLabel>
                                            <SpecValue>{value}</SpecValue>
                                        </SpecItem>
                                    ))
                                ) : (
                                    <p style={{ color: '#6b7280' }}>No specifications available.</p>
                                )}
                            </SpecsGrid>
                        </TabPane>
                        <TabPane tab="Reviews" key="reviews">
                            <TabContent>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '16px' }}>
                                    Customer Reviews
                                </h3>
                                <RatingContainer style={{ marginBottom: '16px' }}>
                                    <Rate disabled defaultValue={product.rating || 0} />
                                    <p style={{ margin: 0, fontSize: '14px' }}>
                                        Based on {product.reviewCount} reviews
                                    </p>
                                </RatingContainer>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                    Review functionality coming soon.
                                </p>
                            </TabContent>
                        </TabPane>
                    </StyledTabs>
                </TabsSection>

                {/* Related Products */}
                <RelatedSection>
                    <SectionTitle>You may also like</SectionTitle>
                    <RelatedGrid>
                        {relatedProducts.map((related) => (
                            <ProductCard key={related._id} product={related} />
                        ))}
                    </RelatedGrid>
                </RelatedSection>
            </Container>
        </PageContainer>
    );
};

export default ProductDetail;
