import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { Spin, Carousel, Button } from 'antd';

const BannerContainer = styled.div`
  width: 100%;
  margin-bottom: ${props => props.$placement === 'home_promo' ? '0' : '40px'};
`;

const PromoStrip = styled.div`
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 10px;
  font-size: 0.9rem;
  letter-spacing: 1px;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
`;

const HeroSlide = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$layout === 'centered_card' ? 'center' : 'flex-start'};

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  padding: 40px;
  background: ${props => props.$layout === 'centered_card' ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  border-radius: ${props => props.$layout === 'centered_card' ? '8px' : '0'};
  margin-left: ${props => props.$layout === 'centered_card' ? '0' : '5%'};
  color: ${props => props.$layout === 'centered_card' ? '#000' : '#fff'};
  text-align: ${props => props.$layout === 'centered_card' ? 'center' : 'left'};
  
  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.2;
    text-shadow: ${props => props.$layout !== 'centered_card' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'};
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 24px;
    color: ${props => props.$layout === 'centered_card' ? '#555' : '#eee'};
    text-shadow: ${props => props.$layout !== 'centered_card' ? '0 1px 4px rgba(0,0,0,0.5)' : 'none'};
  }

  @media (max-width: 768px) {
    padding: 20px;
    h2 { font-size: 2rem; }
    p { font-size: 1rem; }
  }
`;

const StyledButton = styled(Link)`
  display: inline-block;
  padding: 12px 32px;
  background: ${props => props.$layout === 'centered_card' ? '#000' : '#fff'};
  color: ${props => props.$layout === 'centered_card' ? '#fff' : '#000'};
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    color: ${props => props.$layout === 'centered_card' ? '#fff' : '#000'};
  }
`;

const BannerSection = ({ placement }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await axios.get(`/api/banners?placement=${placement}&t=${Date.now()}`);
                console.log(`Banners for ${placement}:`, data);
                setBanners(data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, [placement]);

    if (loading) return null; // Or a skeleton
    if (banners.length === 0) return null;

    if (placement === 'home_promo') {
        // Promo strip logic - usually just one text line or rotating text
        const banner = banners[0];
        console.log(banner);
        return (
            <PromoStrip>
                {banner.title} {banner.link && <Link to={banner.link} style={{ color: 'inherit', textDecoration: 'underline', marginLeft: 10 }}>{banner.linkText || 'Shop Now'}</Link>}
            </PromoStrip>
        );
    }

    if (banners.length === 1) {
        const banner = banners[0];
        return (
            <BannerContainer $placement={placement}>
                <HeroSlide
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                    $layout={banner.layout}
                >
                    <HeroContent $layout={banner.layout}>
                        <h2>{banner.title}</h2>
                        <p>{banner.subtitle}</p>
                        {banner.link && (
                            <StyledButton to={banner.link} $layout={banner.layout}>
                                {banner.linkText || 'Shop Now'}
                            </StyledButton>
                        )}
                    </HeroContent>
                </HeroSlide>
            </BannerContainer>
        );
    }

    return (
        <BannerContainer $placement={placement}>
            <Carousel autoplay effect="fade">
                {banners.map(banner => (
                    <div key={banner.id}>
                        <HeroSlide
                            style={{ backgroundImage: `url(${banner.imageUrl})` }}
                            $layout={banner.layout}
                        >
                            <HeroContent $layout={banner.layout}>
                                <h2>{banner.title}</h2>
                                <p>{banner.subtitle}</p>
                                {banner.link && (
                                    <StyledButton to={banner.link} $layout={banner.layout}>
                                        {banner.linkText || 'Shop Now'}
                                    </StyledButton>
                                )}
                            </HeroContent>
                        </HeroSlide>
                    </div>
                ))}
            </Carousel>
        </BannerContainer>
    );
};

export default BannerSection;
