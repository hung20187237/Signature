import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../../utils/axios';
import { Spin, Select, Empty, Pagination } from 'antd';
import ProductCard from '../../components/Product/ProductCard';
import Breadcrumb from '../../components/Layout/Breadcrumb';

const { Option } = Select;

const PageContainer = styled.div`
  background: white;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px 96px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Description = styled.div`
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 32px;
`;

const CollectionPage = () => {
    const { handle } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('best-selling');

    useEffect(() => {
        fetchCollectionData();
    }, [handle]);

    useEffect(() => {
        if (collection) {
            fetchProducts();
        }
    }, [collection, page, sortBy]);

    const fetchCollectionData = async () => {
        try {
            const { data } = await axios.get(`/api/collections/shop/${handle}`);
            setCollection(data);
            // If collection has a default sort, use it
            if (data.sortOrder) {
                setSortBy(data.sortOrder);
            }
        } catch (error) {
            console.error('Error fetching collection:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/collections/${collection.id}/products`, {
                params: {
                    pageNumber: page,
                    sort: sortBy
                }
            });
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!collection && !loading) return <Empty description="Collection not found" />;

    return (
        <PageContainer>
            <Container>
                <Breadcrumb />

                {collection && (
                    <HeaderSection>
                        <Title>{collection.title}</Title>
                        {collection.description && (
                            <Description dangerouslySetInnerHTML={{ __html: collection.description }} />
                        )}
                    </HeaderSection>
                )}

                <Toolbar>
                    <span>{products.length} products</span>
                    <Select defaultValue="best-selling" value={sortBy} onChange={setSortBy} style={{ width: 200 }}>
                        <Option value="best-selling">Best Selling</Option>
                        <Option value="title-asc">Alphabetically, A-Z</Option>
                        <Option value="title-desc">Alphabetically, Z-A</Option>
                        <Option value="price-asc">Price, low to high</Option>
                        <Option value="price-desc">Price, high to low</Option>
                        <Option value="created-desc">Date, new to old</Option>
                        <Option value="created-asc">Date, old to new</Option>
                    </Select>
                </Toolbar>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                ) : (
                    <>
                        <ProductsGrid>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </ProductsGrid>

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                                <Pagination
                                    current={page}
                                    total={totalPages * 12}
                                    pageSize={12}
                                    onChange={setPage}
                                    showSizeChanger={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </Container>
        </PageContainer>
    );
};

export default CollectionPage;
