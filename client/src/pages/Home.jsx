import React from 'react';
import BannerSection from '../components/Shop/BannerSection';
import FeaturedCollections from '../components/Layout/FeaturedCollections';
import ViralPicks from '../components/Layout/ViralPicks';
import FeaturedReads from '../components/Shop/FeaturedReads';
import AdditionalSections from '../components/Layout/AdditionalSections';

const Home = () => {
    return (
        <div className="bg-white">
            <BannerSection placement="home_promo" />
            <BannerSection placement="home_hero" />
            <FeaturedCollections />
            <ViralPicks />
            <FeaturedReads />
            <AdditionalSections />
        </div>
    );
};

export default Home;
