import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Select, Checkbox, Button, Spin, Tag as AntTag } from 'antd';
import { FilterOutlined, CloseOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ProductCard from '../components/Product/ProductCard';

const { Option } = Select;

// Styled Components (reusing from Shop.jsx with some additions)
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
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.25rem;
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

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ListProductCard = styled.div`
  display: flex;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ListProductImage = styled.div`
  width: 192px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ListProductInfo = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('date-new');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedDeals, setSelectedDeals] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                const newProducts = data.filter(p => p.isNew);
                setProducts(newProducts);
                setFilteredProducts(newProducts);
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

        if (selectedDeals.includes('on-sale')) {
            result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
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
            case 'date-new':
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

    if (loading) {
        return (
            <LoadingContainer>
                <Spin size="large" />
            </LoadingContainer>
        );
    }

    return (
        <PageContainer>
            <Container>
                <Breadcrumb />

                <PageHeader>
                    <PageTitle>New Arrivals</PageTitle>
                </PageHeader>

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
                            <Option value="date-new">Date, new to old</Option>
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
                                                {deal === 'on-sale' ? 'On Sale' : deal}
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
                                        On Sale
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
                                {viewMode === 'grid' ? (
                                    <ProductsGrid>
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </ProductsGrid>
                                ) : (
                                    <ProductsList>
                                        {filteredProducts.map((product) => (
                                            <ListProductCard key={product._id}>
                                                <ListProductImage>
                                                    <img src={product.images[0]} alt={product.name} />
                                                </ListProductImage>
                                                <ListProductInfo>
                                                    <div>
                                                        {product.brand && (
                                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                                {product.brand}
                                                            </p>
                                                        )}
                                                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                                            <Link to={`/product/${product._id}`}>{product.name}</Link>
                                                        </h3>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                                                            {product.originalPrice && (
                                                                <p style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                                                                    ${product.originalPrice.toFixed(2)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Link
                                                            to={`/product/${product._id}`}
                                                            style={{
                                                                padding: '8px 16px',
                                                                background: '#4f46e5',
                                                                color: 'white',
                                                                borderRadius: '6px',
                                                                fontSize: '14px',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </ListProductInfo>
                                            </ListProductCard>
                                        ))}
                                    </ProductsList>
                                )}

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

export default NewArrivals;
