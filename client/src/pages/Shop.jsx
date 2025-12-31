import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Select, Checkbox, InputNumber, Button, Spin, Drawer } from 'antd';
import { FilterOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ProductCard from '../components/Product/ProductCard';
import { useSettings } from '../context/SettingsContext';

const { Option } = Select;

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

const PageHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 24px;
  margin-top: 8px;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 280px 1fr;
  }
`;

const FilterSidebar = styled.aside`
  display: none;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
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
  margin-bottom: 16px;
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

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledInputNumber = styled(InputNumber)`
  && {
    width: 80px;
    
    .ant-input-number-input {
      border-radius: ${props => props.theme.borderRadius.sm};
    }
  }
`;

const ProductsSection = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
`;

const EmptyText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const ClearButton = styled(Button)`
  && {
    margin-top: 16px;
    color: ${props => props.theme.colors.primary};
    
    &:hover {
      color: ${props => props.theme.colors.primaryHover};
    }
  }
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
  background: white;
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.gray50};
    border-color: ${props => props.theme.colors.gray300};
  }
  
  &:first-child {
    border-top-left-radius: ${props => props.theme.borderRadius.md};
    border-bottom-left-radius: ${props => props.theme.borderRadius.md};
  }
  
  &:last-child {
    border-top-right-radius: ${props => props.theme.borderRadius.md};
    border-bottom-right-radius: ${props => props.theme.borderRadius.md};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Shop = () => {
  const { currencySymbol } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlFilter = queryParams.get('filter');
  const urlSort = queryParams.get('sort');
  const urlCategory = queryParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        // Handle Sequelize response format: { products: [], page, pages }
        setProducts(data.products || data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply Filters and Sort
  useEffect(() => {
    let result = [...products];

    // URL Filters
    if (urlFilter === 'deals') {
      result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    if (urlSort === 'new') {
      setSortBy('newest');
    }
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        result.sort((a, b) => (b.isBestSeller === a.isBestSeller ? 0 : b.isBestSeller ? 1 : -1));
    }

    setFilteredProducts(result);
  }, [products, sortBy, selectedBrands, selectedCategories, priceRange, urlFilter, urlSort, urlCategory]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
  };

  const FilterContent = () => (
    <>
      <FilterSection>
        <FilterTitle>Categories</FilterTitle>
        <CheckboxGroup>
          {uniqueCategories.map((category) => (
            <StyledCheckbox
              key={category}
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            >
              {category}
            </StyledCheckbox>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Brands</FilterTitle>
        <CheckboxGroup>
          {uniqueBrands.map((brand) => (
            <StyledCheckbox
              key={brand}
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
            >
              {brand}
            </StyledCheckbox>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Price Range</FilterTitle>
        <PriceRangeContainer>
          <StyledInputNumber
            value={priceRange[0]}
            onChange={(value) => setPriceRange([value, priceRange[1]])}
            min={0}
            prefix={currencySymbol}
          />
          <span>-</span>
          <StyledInputNumber
            value={priceRange[1]}
            onChange={(value) => setPriceRange([priceRange[0], value])}
            min={0}
            prefix={currencySymbol}
          />
        </PriceRangeContainer>
      </FilterSection>
    </>
  );

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
          <PageTitle>
            {urlCategory ? `${urlCategory}` : 'Shop All'}
          </PageTitle>

          <HeaderActions>
            <StyledSelect
              value={sortBy}
              onChange={(value) => setSortBy(value)}
            >
              <Option value="featured">Featured</Option>
              <Option value="newest">Newest</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
              <Option value="rating">Best Rating</Option>
            </StyledSelect>

            <FilterButton
              icon={<FilterOutlined />}
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </FilterButton>
          </HeaderActions>
        </PageHeader>

        <MainContent>
          {/* Desktop Filters */}
          <FilterSidebar>
            <FilterContent />
          </FilterSidebar>

          {/* Mobile Filters Drawer */}
          <Drawer
            title="Filters"
            placement="left"
            onClose={() => setMobileFiltersOpen(false)}
            open={mobileFiltersOpen}
            width={300}
          >
            <FilterContent />
          </Drawer>

          {/* Products Grid */}
          <ProductsSection>
            {filteredProducts.length === 0 ? (
              <EmptyState>
                <EmptyText>No products found matching your criteria.</EmptyText>
                <ClearButton type="link" onClick={clearFilters}>
                  Clear all filters
                </ClearButton>
              </EmptyState>
            ) : (
              <>
                <ProductsGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ProductsGrid>


                {/* Pagination */}
                {filteredProducts.length > 12 && (
                  <Pagination>
                    <PageButton>Previous</PageButton>
                    {Array.from({ length: Math.ceil(filteredProducts.length / 12) }, (_, i) => (
                      <PageButton key={i + 1}>{i + 1}</PageButton>
                    ))}
                    <PageButton>Next</PageButton>
                  </Pagination>
                )}
              </>
            )}
          </ProductsSection>
        </MainContent>
      </Container>
    </PageContainer>
  );
};

export default Shop;
