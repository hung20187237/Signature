import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Rate, Button, Tag, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Styled Components
const Section = styled.section`
  padding: 64px 0;
  background-color: ${props => props.theme.colors.gray50};
`;

const Container = styled.div`
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SectionTitle = styled(Title)`
  && {
    margin: 0;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled(Button)`
  && {
    width: 40px;
    height: 40px;
    border-radius: ${props => props.theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      transform: scale(1.1);
      box-shadow: ${props => props.theme.shadows.md};
    }
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 32px;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Snap scrolling */
  scroll-snap-type: x mandatory;
  
  & > * {
    scroll-snap-align: start;
  }
`;

const StyledCard = styled(Card)`
  min-width: 280px;
  flex-shrink: 0;
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.normal};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    min-width: 320px;
  }
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  aspect-ratio: 4/3;
  width: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.colors.gray200};
  position: relative;
  
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

const ProductName = styled(Link)`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Price = styled(Text)`
  && {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const CTAButton = styled(Button)`
  && {
    width: 100%;
    margin-top: 16px;
    background-color: ${props => props.theme.colors.gray900};
    border-color: ${props => props.theme.colors.gray900};
    color: white;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    height: 40px;
    
    &:hover {
      background-color: ${props => props.theme.colors.gray800} !important;
      border-color: ${props => props.theme.colors.gray800} !important;
      color: white !important;
    }
  }
`;

// Mock data for Viral Picks
const viralProducts = [
    {
        id: 1,
        name: "Otona Collection 3D Stickers / Kamio Japan",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviews: 12,
        stock: "In stock",
        price: 4.50,
        variants: "3 colors available"
    },
    {
        id: 2,
        name: "Zebra Sarasa Clip Vintage Color",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviews: 45,
        stock: "Low stock",
        price: 1.75,
        variants: "5 colors available"
    },
    {
        id: 3,
        name: "Midori MD Notebook Journal",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        rating: 4,
        reviews: 8,
        stock: "In stock",
        price: 14.00,
        variants: null
    },
    {
        id: 4,
        name: "Pilot Iroshizuku Ink Bottle",
        image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviews: 156,
        stock: "In stock",
        price: 22.00,
        variants: "24 colors available"
    },
    {
        id: 5,
        name: "Kokuyo Campus Notebook",
        image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=800&q=80",
        rating: 5,
        reviews: 30,
        stock: "In stock",
        price: 3.50,
        variants: "Dot grid"
    }
];

const ViralPicks = () => {
    const scrollLeft = () => {
        const container = document.getElementById('viral-picks-container');
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const container = document.getElementById('viral-picks-container');
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <Section>
            <Container>
                <Header>
                    <SectionTitle level={2}>Viral Picks</SectionTitle>
                    <NavButtons>
                        <NavButton
                            shape="circle"
                            icon={<LeftOutlined />}
                            onClick={scrollLeft}
                        />
                        <NavButton
                            shape="circle"
                            icon={<RightOutlined />}
                            onClick={scrollRight}
                        />
                    </NavButtons>
                </Header>

                <ScrollContainer id="viral-picks-container">
                    {viralProducts.map((product) => (
                        <StyledCard
                            key={product.id}
                            hoverable
                            cover={
                                <ImageContainer>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                    {product.stock === "Low stock" && (
                                        <Tag color="red" style={{ position: 'absolute', top: 8, left: 8 }}>
                                            Low Stock
                                        </Tag>
                                    )}
                                </ImageContainer>
                            }
                        >
                            <div className="flex items-center mb-2">
                                <Rate disabled defaultValue={product.rating} style={{ fontSize: 14 }} />
                                <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                    ({product.reviews})
                                </Text>
                            </div>

                            <ProductName to={`/product/${product.id}`}>
                                {product.name}
                            </ProductName>

                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <Price strong>
                                        ¥{Math.round(product.price * 150)}
                                    </Price>
                                    {product.variants && (
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {product.variants}
                                            </Text>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="link"
                                    className="text-indigo-600 font-bold uppercase"
                                    style={{ padding: 0, fontSize: 12 }}
                                >
                                    Details
                                </Button>
                            </div>

                            <Link to={`/product/${product.id}`}>
                                <CTAButton>
                                    Choose Options
                                </CTAButton>
                            </Link>
                        </StyledCard>
                    ))}
                </ScrollContainer>
            </Container>
        </Section>
    );
};

export default ViralPicks;
