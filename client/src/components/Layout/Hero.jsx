import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Carousel, Button, Typography } from 'antd';
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Styled Components
const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  background: ${props => props.theme.colors.gray50};
`;

const StyledCarousel = styled(Carousel)`
  .slick-slide {
    height: 500px;
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      height: 600px;
    }
  }
  
  .slick-dots {
    bottom: 24px;
    
    li button {
      background: rgba(255, 255, 255, 0.5);
      height: 8px;
      border-radius: 4px;
    }
    
    li.slick-active button {
      background: white;
      width: 32px;
    }
  }
`;

const SlideContent = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 600px;
  }
`;

const TextSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 24px;
  background: ${props => props.bgColor || props.theme.colors.bgPrimary};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 50%;
    padding: 48px 64px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 48px 96px;
  }
`;

const HeroTitle = styled(Title)`
  && {
    font-size: 2rem;
    font-weight: ${props => props.theme.typography.fontWeight.black};
    margin: 0 0 16px 0;
    line-height: 1.2;
    color: ${props => props.theme.colors.textPrimary};
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 2.5rem;
    }
    
    @media (min-width: ${props => props.theme.breakpoints.lg}) {
      font-size: 3rem;
    }
  }
`;

const HeroSubtitle = styled(Paragraph)`
  && {
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
    max-width: 28rem;
    margin-bottom: 24px;
    line-height: 1.6;
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 1.125rem;
    }
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  span {
    font-family: 'Courier New', monospace;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    font-size: 1.125rem;
    color: ${props => props.theme.colors.error};
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 1.25rem;
    }
  }
`;

const CTAButton = styled(Button)`
  && {
    background-color: ${props => props.theme.colors.gray900};
    border-color: ${props => props.theme.colors.gray900};
    height: 48px;
    font-size: 16px;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    padding: 0 32px;
    border-radius: ${props => props.theme.borderRadius.md};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      background-color: ${props => props.theme.colors.gray800} !important;
      border-color: ${props => props.theme.colors.gray800} !important;
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.lg};
    }
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      height: 56px;
      font-size: 18px;
    }
  }
`;

const ImageSection = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 50%;
    height: 100%;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const NavButton = styled(Button)`
  && {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${props => props.theme.shadows.md};
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      background: white !important;
      transform: translateY(-50%) scale(1.1);
      box-shadow: ${props => props.theme.shadows.lg};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      width: 40px;
      height: 40px;
    }
  }
`;

const PrevButton = styled(NavButton)`
  left: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    left: 24px;
  }
`;

const NextButton = styled(NavButton)`
  right: 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    right: 24px;
  }
`;

const slides = [
    {
        id: 1,
        title: "Latest in Stationery",
        subtitle: "Shop our newest arrivals and upgrade your creative toolkit today",
        cta: "Shop New Arrivals",
        link: "/shop?sort=new",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
        bgColor: "#eff6ff" // blue-50
    },
    {
        id: 2,
        title: "Black Friday Sale",
        subtitle: "Save up to 50% on premium stationery. Limited time offer!",
        cta: "Shop Deals",
        link: "/shop?filter=deals",
        image: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?auto=format&fit=crop&w=2070&q=80",
        bgColor: "#fef2f2", // red-50
        isSale: true
    },
    {
        id: 3,
        title: "Gifts That Inspire",
        subtitle: "Find the perfect present for the stationery lover in your life",
        cta: "Shop Now",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=2070&q=80",
        bgColor: "#f0fdf4" // green-50
    }
];

const Hero = () => {
    const carouselRef = React.useRef();

    return (
        <HeroContainer>
            <StyledCarousel
                ref={carouselRef}
                autoplay
                autoplaySpeed={5000}
                effect="fade"
            >
                {slides.map((slide) => (
                    <div key={slide.id}>
                        <SlideContent>
                            {/* Text Content */}
                            <TextSection bgColor={slide.bgColor}>
                                <HeroTitle level={1}>
                                    {slide.title}
                                </HeroTitle>
                                <HeroSubtitle>
                                    {slide.subtitle}
                                </HeroSubtitle>

                                {slide.isSale && (
                                    <CountdownContainer>
                                        <span>02 Days</span>
                                        <span>14 Hours</span>
                                        <span>30 Mins</span>
                                    </CountdownContainer>
                                )}

                                <Link to={slide.link}>
                                    <CTAButton
                                        type="primary"
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        iconPosition="end"
                                    >
                                        {slide.cta}
                                    </CTAButton>
                                </Link>
                            </TextSection>

                            {/* Image Content */}
                            <ImageSection>
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                />
                            </ImageSection>
                        </SlideContent>
                    </div>
                ))}
            </StyledCarousel>

            {/* Navigation Buttons */}
            <PrevButton
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() => carouselRef.current?.prev()}
            />
            <NextButton
                shape="circle"
                icon={<RightOutlined />}
                onClick={() => carouselRef.current?.next()}
            />
        </HeroContainer>
    );
};

export default Hero;
