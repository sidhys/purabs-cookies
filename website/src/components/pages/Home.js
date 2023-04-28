import React from 'react';
import '../../App.css';
import PopularCards from '../PopularCards';
import HeroSection from '../HeroSection';
import Footer from '../Footer';

function Home() {
  return (
    <>
      <HeroSection />
      <PopularCards />
      <Footer />
    </>
  );
}

export default Home;
