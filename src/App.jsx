import React, { useEffect, useState } from 'react';
import BackgroundTexture from './components/BackgroundTexture';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Packages from './components/Packages';
import AboutUs from './components/AboutUs';
import Reviews from './components/Reviews';
import ReservationModal from './components/ReservationModal';
import DestinationModal from './components/DestinationModal';
import SelectorModal from './components/SelectorModal';
import QueryModal from './components/AuthModal';
import ReservationResultsModal from './components/ProfileModal';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [queryData, setQueryData] = useState(null);
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
    setIsReservationModalOpen(true);
  };

  const handleCloseReservation = () => {
    setIsReservationModalOpen(false);
  };

  const handleOpenDestinationModal = (destinationName = '') => {
    setSelectedDestination(destinationName);
    setIsDestinationModalOpen(true);
  };

  const handleCloseDestinationModal = () => {
    setIsDestinationModalOpen(false);
  };

  const handleOpenSelector = () => {
    setIsSelectorModalOpen(true);
  };

  const handleCloseSelector = () => {
    setIsSelectorModalOpen(false);
  };

  const handleOpenQuery = () => {
    setIsQueryModalOpen(true);
  };

  const handleCloseQuery = () => {
    setIsQueryModalOpen(false);
  };

  const handleQueryResults = (data) => {
    setQueryData(data);
    setIsQueryModalOpen(false);
    setIsResultsModalOpen(true);
  };

  const handleCloseResults = () => {
    setIsResultsModalOpen(false);
    setQueryData(null);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-andes-gold/30 selection:text-andes-forest dark:selection:text-andes-bone">
      <BackgroundTexture />

      <Navbar
        onOpenReservation={handleOpenSelector}
        isDarkMode={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onOpenQuery={handleOpenQuery}
      />

      <main className="flex-1">
        <Hero />

        <Destinations onSelectDestination={handleOpenDestinationModal} />

        <Packages onSelectPackage={handleOpenReservation} />

        <AboutUs onContactClick={() => handleOpenReservation()} />

        <Reviews />
      </main>

      <Footer onOpenReservation={handleOpenReservation} />

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleCloseReservation}
        defaultDestination={selectedDestination}
      />

      <DestinationModal
        isOpen={isDestinationModalOpen}
        onClose={handleCloseDestinationModal}
        defaultDestination={selectedDestination}
      />

      <SelectorModal
        isOpen={isSelectorModalOpen}
        onClose={handleCloseSelector}
        onSelectRoute={() => handleOpenReservation()}
        onSelectDestination={() => handleOpenDestinationModal()}
      />

      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={handleCloseQuery}
        onResults={handleQueryResults}
      />

      <ReservationResultsModal
        isOpen={isResultsModalOpen}
        onClose={handleCloseResults}
        queryData={queryData}
      />
    </div>
  );
}

export default App;
