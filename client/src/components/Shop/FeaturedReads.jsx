import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { Row, Col, Card } from 'antd';
import dayjs from 'dayjs';

const Section = styled.section`
  padding: 80px 20px;
  background: #fff;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  
  a {
      color: #666;
      text-decoration: underline;
      &:hover { color: #000; }
  }
`;

const BlogCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
  
  &:hover {
    color: inherit;
    h3 { text-decoration: underline; }
  }
`;

const Image = styled.div`
  height: 240px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
`;

const DateText = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const Excerpt = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
`;

const FeaturedReads = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('/api/blog/posts', {
                    params: { limit: 3 }
                });
                setPosts(data.posts);
            } catch (error) {
                console.error('Failed to fetch featured reads');
            }
        };
        fetchPosts();
    }, []);

    if (posts.length === 0) return null;

    return (
        <Section>
            <Container>
                <SectionHeader>
                    <h2>From Our Reads</h2>
                    <Link to="/reads">View All Stories</Link>
                </SectionHeader>

                <Row gutter={[32, 32]}>
                    {posts.map(post => (
                        <Col xs={24} md={8} key={post.id}>
                            <BlogCard to={`/reads/${post.slug}`}>
                                <Image style={{ backgroundImage: `url(${post.thumbnailUrl || '/placeholder.png'})` }} />
                                <DateText>{dayjs(post.publishedAt).format('MMMM D, YYYY')}</DateText>
                                <Title>{post.title}</Title>
                                <Excerpt>{post.excerpt}</Excerpt>
                            </BlogCard>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Section>
    );
};

export default FeaturedReads;
