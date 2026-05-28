import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BackgroundTexture from './components/BackgroundTexture';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Packages from './components/Packages';
import AboutUs from './components/AboutUs';
import Reviews from './components/Reviews';
import ReservationModal from './components/ReservationModal';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleOpenReservation = (destinationName = '') => {
    setSelectedDestination(destinationName);
    setIsModalOpen(true);
  };

  const handleCloseReservation = () => {
    setIsModalOpen(false);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  // Reusable animation configuration for subtle slide-up
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } // Custom cubic-bezier for premium feel
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-andes-gold/30 selection:text-andes-forest dark:selection:text-andes-bone">
      <BackgroundTexture />

      <Navbar
        onOpenReservation={handleOpenReservation}
        isDarkMode={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        <Hero onOpenReservation={handleOpenReservation} />

        <motion.div {...fadeInUp}>
          <Destinations onSelectDestination={handleOpenReservation} />
        </motion.div>

        <motion.div {...fadeInUp}>
          <Packages onSelectPackage={handleOpenReservation} />
        </motion.div>

        <motion.div {...fadeInUp}>
          <AboutUs onContactClick={() => handleOpenReservation()} />
        </motion.div>

        <motion.div {...fadeInUp}>
          <Reviews />
        </motion.div>
      </main>

      <Footer onOpenReservation={handleOpenReservation} />

      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseReservation}
        defaultDestination={selectedDestination}
      />
    </div>
  );
}

export default App;
