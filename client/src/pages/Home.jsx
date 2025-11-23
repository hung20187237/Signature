import React from 'react';
import Hero from '../components/Layout/Hero';
import FeaturedCollections from '../components/Layout/FeaturedCollections';
import ViralPicks from '../components/Layout/ViralPicks';
import AdditionalSections from '../components/Layout/AdditionalSections';

const Home = () => {
    return (
        <div className="bg-white">
            <Hero />
            <FeaturedCollections />
            <ViralPicks />
            <AdditionalSections />
        </div>
    );
};

export default Home;
