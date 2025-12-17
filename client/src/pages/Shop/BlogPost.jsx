import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { Spin, Tag, Breadcrumb } from 'antd';
import dayjs from 'dayjs';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PostHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 20px 0;
  line-height: 1.2;
`;

const Meta = styled.div`
  color: #666;
  font-size: 0.95rem;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;

  h2 { margin-top: 40px; margin-bottom: 20px; font-size: 1.8rem; }
  h3 { margin-top: 30px; margin-bottom: 15px; font-size: 1.5rem; }
  p { margin-bottom: 20px; }
  img { max-width: 100%; border-radius: 4px; margin: 20px 0; }
  blockquote {
      border-left: 4px solid #000;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      color: #555;
  }
`;

const Tags = styled.div`
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const ShopBlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/blog/posts/${slug}`);
            setPost(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
    if (!post) return <div style={{ textAlign: 'center', padding: 100 }}>Post not found</div>;

    return (
        <Container>
            <Breadcrumb style={{ marginBottom: 20 }}>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/reads">Reads</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
            </Breadcrumb>

            <PostHeader>
                <Tag color="blue">{post.category?.name}</Tag>
                <Title>{post.title}</Title>
                <Meta>
                    <span>By {post.authorName}</span>
                    <span>•</span>
                    <span>{dayjs(post.publishedAt).format('MMMM D, YYYY')}</span>
                </Meta>
            </PostHeader>

            {post.thumbnailUrl && (
                <Thumbnail src={post.thumbnailUrl} alt={post.title} />
            )}

            <Content dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.tags && post.tags.length > 0 && (
                <Tags>
                    <span style={{ marginRight: 10, fontWeight: 'bold' }}>Tags:</span>
                    {post.tags.map(tag => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                    ))}
                </Tags>
            )}
        </Container>
    );
};

export default ShopBlogPost;
