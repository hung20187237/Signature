import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Select, Checkbox, Button, Spin, Tag as AntTag } from 'antd';
import { FilterOutlined, ClockCircleOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ProductCard from '../components/Product/ProductCard';

const { Option } = Select;

// Styled Components
const PageContainer = styled.div`
  background: white;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #db2777 100%);
  color: white;
  padding: 48px 0;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: 64px 0;
  }
`;

const HeroContainer = styled.div`
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

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: center;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
`;

const HeroContent = styled.div``;

const HeroLabel = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: 8px;
  opacity: 0.9;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const HeroDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: 24px;
  opacity: 0.9;
  line-height: 1.6;
`;

const CountdownBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  margin-bottom: 16px;
`;

const CountdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
`;

const CountdownItem = styled.div``;

const CountdownValue = styled.div`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const CountdownLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  opacity: 0.75;
  margin-top: 4px;
`;

const CountdownFooter = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  text-align: center;
  margin-top: 12px;
  opacity: 0.75;
`;

const HeroImage = styled.div`
  display: none;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
  
  img {
    width: 100%;
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: ${props => props.theme.shadows['2xl']};
  }
`;

const DealCollectionsSection = styled.div`
  background-color: ${props => props.theme.colors.gray50};
  padding: 48px 0;
`;

const DealCollectionsContainer = styled.div`
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

const DealCollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const DealCollectionCard = styled(Link)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const DealCollectionImage = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${props => props.theme.transitions.slow};
  }
  
  ${DealCollectionCard}:hover & img {
    transform: scale(1.05);
  }
`;

const DealCollectionInfo = styled.div`
  padding: 12px;
  text-align: center;
`;

const DealCollectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const DealCollectionLink = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.primary};
  margin: 0;
  
  ${DealCollectionCard}:hover & {
    text-decoration: underline;
  }
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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ViewModeButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    
    ${props => props.$active && `
      background-color: ${props.theme.colors.gray200};
      color: ${props.theme.colors.textPrimary};
    `}
  }
`;

const FilterButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
    
    @media (min-width: ${props => props.theme.breakpoints.lg}) {
      display: none;
    }
  }
`;

const FilterBadge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
`;

const StyledSelect = styled(Select)`
  && {
    min-width: 200px;
    
    .ant-select-selector {
      border-radius: ${props => props.theme.borderRadius.md};
      border-color: ${props => props.theme.colors.border};
      
      &:hover {
        border-color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 280px 1fr;
  }
`;

const FilterSidebar = styled.aside`
  display: ${props => props.$show ? 'block' : 'none'};
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const StickyFilters = styled.div`
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AppliedFiltersBox = styled.div`
  background-color: ${props => props.theme.colors.gray50};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const AppliedFiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const AppliedFiltersTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const ClearAllButton = styled(Button)`
  && {
    font-size: ${props => props.theme.typography.fontSize.xs};
    color: ${props => props.theme.colors.primary};
    padding: 0;
    height: auto;
    
    &:hover {
      color: ${props => props.theme.colors.primaryHover};
    }
  }
`;

const FilterTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterTag = styled(AntTag)`
  && {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: ${props => props.theme.borderRadius.full};
    background: white;
    border: 1px solid ${props => props.theme.colors.border};
    margin: 0;
  }
`;

const FilterSection = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 0;
  
  &:first-child {
    padding-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledCheckbox = styled(Checkbox)`
  && {
    .ant-checkbox-inner {
      border-radius: ${props => props.theme.borderRadius.sm};
    }
    
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${props => props.theme.colors.primary};
      border-color: ${props => props.theme.colors.primary};
    }
    
    span {
      font-size: ${props => props.theme.typography.fontSize.sm};
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const MobileApplyButton = styled(Button)`
  && {
    width: 100%;
    margin-top: 16px;
    
    @media (min-width: ${props => props.theme.breakpoints.lg}) {
      display: none;
    }
  }
`;

const ProductsSection = styled.main`
  min-height: 400px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    gap: 32px;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #dc2626;
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.sm};
  z-index: 10;
`;

const ProductWrapper = styled.div`
  position: relative;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
`;

const EmptyText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 48px;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primaryHover : props.theme.colors.gray50};
    border-color: ${props => props.$active ? props.theme.colors.primaryHover : props.theme.colors.gray300};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Filter states
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Countdown timer
  useEffect(() => {
    const endDate = new Date('2025-12-03T13:59:00');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const saleProducts = data.filter(p => p.originalPrice && p.originalPrice > p.price);
        setProducts(saleProducts);
        setFilteredProducts(saleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    if (selectedDeals.includes('clearance')) {
      result = result.filter(p => p.stock && p.stock < 5);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Sorting
    switch (sortBy) {
      case 'featured':
        result.sort((a, b) => (b.isBestSeller === a.isBestSeller ? 0 : b.isBestSeller ? 1 : -1));
        break;
      case 'best-selling':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedDeals, selectedCategories, selectedBrands, sortBy]);

  const toggleFilter = (filterType, value) => {
    const setters = {
      deals: setSelectedDeals,
      categories: setSelectedCategories,
      brands: setSelectedBrands,
    };

    const setter = setters[filterType];
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedDeals([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const appliedFiltersCount = selectedDeals.length + selectedCategories.length + selectedBrands.length;

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const dealCollections = [
    { title: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?auto=format&fit=crop&w=800&q=80', href: '/collections/deals-30' },
    { title: 'Up to 50% Off', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80', href: '/collections/deals-50' },
    { title: 'Production-Used', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', href: '/collections/production-used' },
    { title: 'Pens', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80', href: '/collections/deals-pens' },
    { title: 'Notebooks', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80', href: '/collections/deals-notebooks' },
    { title: 'Cases & Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', href: '/collections/deals-cases' },
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContainer>
          <HeroGrid>
            <HeroContent>
              <HeroLabel>Offer Ends Dec 2nd, 23:59 EST</HeroLabel>
              <HeroTitle>Black Friday Sale</HeroTitle>
              <HeroDescription>
                Save up to 50% with exclusive discounts on pens, notebooks, and everyday essentials.
              </HeroDescription>

              {/* Countdown Timer */}
              <CountdownBox>
                <CountdownHeader>
                  <ClockCircleOutlined style={{ fontSize: '20px' }} />
                  <span>Time Remaining</span>
                </CountdownHeader>
                <CountdownGrid>
                  <CountdownItem>
                    <CountdownValue>{timeLeft.days}</CountdownValue>
                    <CountdownLabel>Days</CountdownLabel>
                  </CountdownItem>
                  <CountdownItem>
                    <CountdownValue>{timeLeft.hours}</CountdownValue>
                    <CountdownLabel>Hours</CountdownLabel>
                  </CountdownItem>
                  <CountdownItem>
                    <CountdownValue>{timeLeft.minutes}</CountdownValue>
                    <CountdownLabel>Minutes</CountdownLabel>
                  </CountdownItem>
                  <CountdownItem>
                    <CountdownValue>{timeLeft.seconds}</CountdownValue>
                    <CountdownLabel>Seconds</CountdownLabel>
                  </CountdownItem>
                </CountdownGrid>
                <CountdownFooter>Ends December 3, 2025 at 1:59 pm</CountdownFooter>
              </CountdownBox>
            </HeroContent>
            <HeroImage>
              <img
                src="https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?auto=format&fit=crop&w=1200&q=80"
                alt="Black Friday Sale"
              />
            </HeroImage>
          </HeroGrid>
        </HeroContainer>
      </HeroSection>

      {/* Deal Collections */}
      <DealCollectionsSection>
        <DealCollectionsContainer>
          <DealCollectionsGrid>
            {dealCollections.map((collection, idx) => (
              <DealCollectionCard key={idx} to={collection.href}>
                <DealCollectionImage>
                  <img src={collection.image} alt={collection.title} />
                </DealCollectionImage>
                <DealCollectionInfo>
                  <DealCollectionTitle>{collection.title}</DealCollectionTitle>
                  <DealCollectionLink>View collection</DealCollectionLink>
                </DealCollectionInfo>
              </DealCollectionCard>
            ))}
          </DealCollectionsGrid>
        </DealCollectionsContainer>
      </DealCollectionsSection>

      {/* Main Content */}
      <Container>
        <Breadcrumb />

        <Toolbar>
          <ToolbarLeft>
            <FilterButton
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {appliedFiltersCount > 0 && (
                <FilterBadge>{appliedFiltersCount}</FilterBadge>
              )}
            </FilterButton>

            <StyledSelect
              value={sortBy}
              onChange={(value) => setSortBy(value)}
            >
              <Option value="featured">Featured</Option>
              <Option value="best-selling">Best selling</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
            </StyledSelect>
          </ToolbarLeft>

          <ToolbarRight>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>View:</span>
            <ViewModeButton
              $active={viewMode === 'list'}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
            />
            <ViewModeButton
              $active={viewMode === 'grid'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')}
            />
          </ToolbarRight>
        </Toolbar>

        <MainContent>
          <FilterSidebar $show={showFilters}>
            <StickyFilters>
              {appliedFiltersCount > 0 && (
                <AppliedFiltersBox>
                  <AppliedFiltersHeader>
                    <AppliedFiltersTitle>Applied Filters</AppliedFiltersTitle>
                    <ClearAllButton type="link" onClick={clearAllFilters}>
                      Clear all
                    </ClearAllButton>
                  </AppliedFiltersHeader>
                  <FilterTagsContainer>
                    {selectedDeals.map(deal => (
                      <FilterTag
                        key={deal}
                        closable
                        onClose={() => toggleFilter('deals', deal)}
                      >
                        {deal === 'clearance' ? 'Clearance' : deal}
                      </FilterTag>
                    ))}
                    {selectedCategories.map(cat => (
                      <FilterTag
                        key={cat}
                        closable
                        onClose={() => toggleFilter('categories', cat)}
                      >
                        {cat}
                      </FilterTag>
                    ))}
                    {selectedBrands.map(brand => (
                      <FilterTag
                        key={brand}
                        closable
                        onClose={() => toggleFilter('brands', brand)}
                      >
                        {brand}
                      </FilterTag>
                    ))}
                  </FilterTagsContainer>
                </AppliedFiltersBox>
              )}

              <FilterSection>
                <FilterTitle>Deals</FilterTitle>
                <CheckboxGroup>
                  <StyledCheckbox
                    checked={selectedDeals.includes('on-sale')}
                    onChange={() => toggleFilter('deals', 'on-sale')}
                  >
                    On Sale ({products.length})
                  </StyledCheckbox>
                  <StyledCheckbox
                    checked={selectedDeals.includes('clearance')}
                    onChange={() => toggleFilter('deals', 'clearance')}
                  >
                    Clearance
                  </StyledCheckbox>
                </CheckboxGroup>
              </FilterSection>

              <FilterSection>
                <FilterTitle>Category</FilterTitle>
                <CheckboxGroup>
                  {uniqueCategories.map(category => (
                    <StyledCheckbox
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleFilter('categories', category)}
                    >
                      {category}
                    </StyledCheckbox>
                  ))}
                </CheckboxGroup>
              </FilterSection>

              <FilterSection>
                <FilterTitle>Brand</FilterTitle>
                <CheckboxGroup>
                  {uniqueBrands.map(brand => (
                    <StyledCheckbox
                      key={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleFilter('brands', brand)}
                    >
                      {brand}
                    </StyledCheckbox>
                  ))}
                </CheckboxGroup>
              </FilterSection>

              <MobileApplyButton
                type="primary"
                onClick={() => setShowFilters(false)}
              >
                Show {filteredProducts.length} results
              </MobileApplyButton>
            </StickyFilters>
          </FilterSidebar>

          <ProductsSection>
            {filteredProducts.length === 0 ? (
              <EmptyState>
                <EmptyText>No products found matching your criteria.</EmptyText>
                <Button type="link" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </EmptyState>
            ) : (
              <>
                <ProductsGrid>
                  {filteredProducts.map((product) => {
                    const discountPercent = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <ProductWrapper key={product._id}>
                        {discountPercent > 0 && (
                          <DiscountBadge>
                            {discountPercent}% OFF
                          </DiscountBadge>
                        )}
                        <ProductCard product={product} />
                      </ProductWrapper>
                    );
                  })}
                </ProductsGrid>

                <Pagination>
                  <PageButton>Previous</PageButton>
                  <PageButton $active>1</PageButton>
                  <PageButton>2</PageButton>
                  <PageButton>3</PageButton>
                  <PageButton>Next</PageButton>
                </Pagination>
              </>
            )}
          </ProductsSection>
        </MainContent>
      </Container>
    </PageContainer>
  );
};

export default DealsPage;
