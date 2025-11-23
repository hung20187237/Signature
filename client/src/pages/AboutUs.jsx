import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TrophyOutlined, SafetyOutlined, CompressOutlined, HeartOutlined } from '@ant-design/icons';

// Styled Components
const PageContainer = styled.div`
  background: white;
`;

const HeroSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 80px 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 96px 32px;
  }
`;

const HeroContent = styled.div`
  text-center;
  margin-bottom: 48px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
  
  p {
    font-size: ${props => props.theme.typography.fontSize.lg};
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.8;
    margin: 0;
  }
`;

const HeroImage = styled.div`
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows['2xl']};
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      height: 500px;
    }
  }
`;

const ValuesSection = styled.section`
  background-color: ${props => props.theme.colors.gray50};
  padding: 80px 0;
`;

const ValuesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
  margin-bottom: 48px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.25rem;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ValueCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 32px;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-4px);
  }
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${props => props.theme.colors.primary}15;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .anticon {
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
  }
`;

const ValueContent = styled.div`
  flex: 1;
`;

const ValueTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 12px 0;
`;

const ValueDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const DividerImage = styled.section`
  padding: 0;
  
  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      height: 400px;
    }
  }
`;

const CEOSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 96px 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 112px 32px;
  }
`;

const CEOGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 3fr 2fr;
    gap: 64px;
  }
`;

const CEOContent = styled.div`
  position: relative;
  padding-left: 24px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const CEOMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  p {
    font-size: ${props => props.theme.typography.fontSize.base};
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.8;
    margin: 0;
    
    &:first-child {
      font-size: ${props => props.theme.typography.fontSize.lg};
      font-style: italic;
      color: ${props => props.theme.colors.textPrimary};
    }
  }
`;

const CEOSignature = styled.div`
  padding-top: 24px;
  
  p {
    margin: 0;
    
    &:first-child {
      font-weight: ${props => props.theme.typography.fontWeight.semibold};
      color: ${props => props.theme.colors.textPrimary};
      font-size: ${props => props.theme.typography.fontSize.base};
    }
    
    &:last-child {
      font-size: ${props => props.theme.typography.fontSize.sm};
      color: ${props => props.theme.colors.textSecondary};
      margin-top: 4px;
    }
  }
`;

const CEOImageWrapper = styled.div`
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows['2xl']};
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      height: 500px;
    }
  }
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15 0%, ${props => props.theme.colors.primary}10 100%);
  padding: 80px 0;
`;

const CTAContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 24px;
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 32px;
  }
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 24px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const CTADescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 16px 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-2px);
    color: white;
  }
`;

const AboutUs = () => {
    const values = [
        {
            icon: TrophyOutlined,
            title: 'Excellence',
            description: 'We maintain the highest standards in product curation, continuously improving our selection and ensuring every detail of the customer experience is meticulously crafted.'
        },
        {
            icon: SafetyOutlined,
            title: 'Integrity',
            description: 'We believe in transparency, honesty, and accountability. We keep our promises and build trust through consistent, reliable service to our global community.'
        },
        {
            icon: CompressOutlined,
            title: 'Simplicity',
            description: 'We prioritize clear, intuitive interfaces and straightforward service. Everything we do is designed to feel coherent, accessible, and friendly to our customers.'
        },
        {
            icon: HeartOutlined,
            title: 'Care',
            description: 'We emphasize empathy and attention to ourselves, our team, and the environment, so we can provide the best care for our customers and the products we share.'
        }
    ];

    return (
        <PageContainer>
            {/* Hero Introduction */}
            <HeroSection>
                <HeroContent>
                    <PageTitle>Welcome to Signature</PageTitle>
                    <IntroText>
                        <p>
                            We are an online store specializing in curated Japanese stationery and lifestyle goods,
                            shipping from Tokyo to customers worldwide. Founded in 2023 by Shusuke Alex Minami,
                            our mission is to connect global customers with the creativity and quality of Japanese
                            design in everyday life.
                        </p>
                        <p>
                            Our product range spans from major established brands to small independent makers,
                            including our own Signature originals. We offer everything from traditional Japanese
                            stationery to the latest innovative products, carefully selected to bring you the best
                            of Japanese craftsmanship.
                        </p>
                        <p>
                            With international shipping to over 100 countries, we take pride in bringing exclusive
                            Japanese products to customers around the globe. Every order is hand-packed at our
                            Tokyo studio with care and attention to detail.
                        </p>
                    </IntroText>
                </HeroContent>

                <HeroImage>
                    <img
                        src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80"
                        alt="Tokyo Studio"
                    />
                </HeroImage>
            </HeroSection>

            {/* Our Values */}
            <ValuesSection>
                <ValuesContainer>
                    <SectionTitle>Our Values</SectionTitle>
                    <ValuesGrid>
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <ValueCard key={index}>
                                    <ValueHeader>
                                        <IconWrapper>
                                            <Icon />
                                        </IconWrapper>
                                        <ValueContent>
                                            <ValueTitle>{value.title}</ValueTitle>
                                            <ValueDescription>{value.description}</ValueDescription>
                                        </ValueContent>
                                    </ValueHeader>
                                </ValueCard>
                            );
                        })}
                    </ValuesGrid>
                </ValuesContainer>
            </ValuesSection>

            {/* Divider Image */}
            <DividerImage>
                <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
                    alt="Workspace"
                />
            </DividerImage>

            {/* Message From the CEO */}
            <CEOSection>
                <SectionTitle>Message From the CEO</SectionTitle>
                <CEOGrid>
                    <CEOContent>
                        <CEOMessage>
                            <p>
                                "The Signature Experience is not just about selling stationery—it's about sharing
                                Japanese design culture with care and attention to detail."
                            </p>
                            <p>
                                Every order is hand-packed at our studio in Tokyo, using our custom packaging
                                materials. We handle duties and fees upfront so international customers receive
                                their orders just like a domestic purchase, with no surprises.
                            </p>
                            <p>
                                Our goal is to elevate the standard of Japanese stationery experiences globally
                                and reflect the spirit behind each product we share. We believe that the tools
                                you use every day should bring joy and inspiration to your work and creativity.
                            </p>
                        </CEOMessage>
                        <CEOSignature>
                            <p>— Shusuke Alex Minami</p>
                            <p>CEO of Signature</p>
                        </CEOSignature>
                    </CEOContent>

                    <CEOImageWrapper>
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                            alt="CEO"
                        />
                    </CEOImageWrapper>
                </CEOGrid>
            </CEOSection>

            {/* What's Inside the Signature Experience */}
            <CTASection>
                <CTAContainer>
                    <CTATitle>
                        What's Inside the Signature Experience
                    </CTATitle>
                    <CTADescription>
                        Discover how we bring Japanese stationery culture to your doorstep with our unique
                        packaging, international service, and commitment to quality. Every detail is designed
                        to make your experience exceptional.
                    </CTADescription>
                    <CTAButton to="/pages/our-service">
                        Learn More
                    </CTAButton>
                </CTAContainer>
            </CTASection>
        </PageContainer>
    );
};

export default AboutUs;
