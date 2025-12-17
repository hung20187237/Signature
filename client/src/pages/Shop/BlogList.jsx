import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { Spin, Row, Col, Card, Tag, Input } from 'antd';
import dayjs from 'dayjs';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  p {
      color: #666;
      font-size: 1.1rem;
  }
`;

const BlogCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    color: inherit;
  }
`;

const BlogImage = styled.div`
  height: 200px;
  width: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 8px 8px 0 0;
  background-color: #f0f0f0;
`;

const BlogContent = styled.div`
  padding: 20px;
  border: 1px solid #eee;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: white;
  height: calc(100% - 200px);
  display: flex;
  flex-direction: column;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #333;
`;

const Excerpt = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ShopBlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  useEffect(() => {
    fetchPosts();
  }, [category, tag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (tag) params.tag = tag;

      const { data } = await axios.get('/api/blog/posts', { params });
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Bungu Reads</h1>
        <p>Stories, guides, and news from the world of stationery.</p>
      </Header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[32, 32]}>
          {posts.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <BlogCard to={`/reads/${post.slug}`}>
                <BlogImage style={{ backgroundImage: `url(${post.thumbnailUrl || '/placeholder.png'})` }} />
                <BlogContent>
                  <Meta>
                    <span>{dayjs(post.publishedAt).format('MMM D, YYYY')}</span>
                    {post.category && <Tag>{post.category.name}</Tag>}
                  </Meta>
                  <Title>{post.title}</Title>
                  <Excerpt>{post.excerpt}</Excerpt>
                </BlogContent>
              </BlogCard>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ShopBlogList;
