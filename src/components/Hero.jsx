import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';

export default function Hero({ onOpenReservation }) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('2');
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [travelersOpen, setTravelersOpen] = useState(false);
  const destinationRef = useRef(null);
  const travelersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setDestinationOpen(false);
      }
      if (travelersRef.current && !travelersRef.current.contains(event.target)) {
        setTravelersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const destinationOptions = [
    { label: 'Páramos y Teleférico', value: 'Mérida - Teleférico Mukumbarí' },
    { label: 'Pico Bolívar (Trekking)', value: 'Pico Bolívar - Ruta Alta Montaña' },
    { label: 'Pueblos del Sur', value: 'Ruta de los Pueblos del Sur' },
    { label: 'La Culata y Termas', value: 'Páramo La Culata y Aguas Termales' },
  ];

  const travelersOptions = [
    { label: '1 Persona', value: '1' },
    { label: '2 Personas', value: '2' },
    { label: '3 Personas', value: '3' },
    { label: '4+ Personas', value: '4' },
  ];

  const selectedDestinationLabel = destinationOptions.find((option) => option.value === destination)?.label;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onOpenReservation(destination);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-andes-forest text-white overflow-hidden py-20 px-6 sm:px-8 lg:px-12">
      {/* Background Image with elegant overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop"
          alt="Andes Venezolanos"
          className="w-full h-full object-cover object-center opacity-85 scale-100 transform transition-transform duration-10000 ease-out"
          style={{ animation: 'zoomOut 20s infinite alternate' }}
        />
        {/* Subtle neutral gradients to keep the hero image balanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-900/10 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center">
        
        {/* Subtitle / Category tag */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs sm:text-sm font-semibold tracking-widest text-andes-gold uppercase mb-4"
        >
          Ecoturismo & Aventura Andina
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] max-w-4xl"
        >
          Travesías memorables por el corazón de los Andes
        </motion.h1>

        {/* Subtitle Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-stone-200/90 font-light max-w-2xl leading-relaxed font-sans"
        >
          Rutas de montaña exclusivas y el encanto natural de los pueblos de Mérida, Táchira y Trujillo. Una experiencia unica e inolvidable.
        </motion.p>

        {/* Search Engine Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mt-12 p-0"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-stretch">

            <div className="flex items-center gap-4 w-full md:flex-1 md:min-w-[12rem] rounded-xl bg-black/40 border border-white/20 backdrop-blur-md px-4 py-4">
              <MapPin className="w-5 h-5 shrink-0 text-yellow-400" />
              <div className="min-w-0">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/90 mb-1">
                  DESTINO
                </label>
                <div ref={destinationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDestinationOpen((open) => !open)}
                    className="hero-select w-full appearance-none text-left bg-transparent text-sm font-medium text-white placeholder:text-slate-300 border-0 focus:ring-0 focus:outline-none cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span className={selectedDestinationLabel ? 'block' : 'text-slate-300 dark:text-andes-bone/60'}>
                      {selectedDestinationLabel || '¿A dónde viajamos?'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {destinationOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-3 rounded-2xl border border-white/10 bg-[#303030] shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden">
                      {destinationOptions.map((option, idx) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setDestination(option.value);
                            setDestinationOpen(false);
                          }}
                          className={`w-full px-4 py-3 md:py-3 text-left text-sm font-medium text-white bg-[#303030] transition-colors hover:bg-gray-700 ${idx < destinationOptions.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:flex-1 md:min-w-[12rem] rounded-xl bg-black/40 border border-white/20 backdrop-blur-md px-4 py-4">
              <Calendar className="w-5 h-5 shrink-0 text-yellow-400" />
              <div className="min-w-0">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/90 mb-1">
                  CUÁNDO
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white placeholder:text-slate-300 border-0 focus:ring-0 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:flex-1 md:min-w-[12rem] rounded-xl bg-black/40 border border-white/20 backdrop-blur-md px-4 py-4">
              <Users className="w-5 h-5 shrink-0 text-yellow-400" />
              <div className="min-w-0">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/90 mb-1">
                  VIAJEROS
                </label>
                <div ref={travelersRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setTravelersOpen((open) => !open)}
                    className="hero-select w-full appearance-none text-left bg-transparent text-sm font-medium text-white placeholder:text-slate-300 border-0 focus:ring-0 focus:outline-none cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span>{travelersOptions.find((option) => option.value === people)?.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {travelersOpen && (
                    <div className="absolute left-0 right-0 z-30 mt-3 rounded-2xl border border-white/10 bg-[#303030] shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden">
                      {travelersOptions.map((option, idx) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setPeople(option.value);
                            setTravelersOpen(false);
                          }}
                          className={`w-full px-4 py-3 md:py-3 text-left text-sm font-medium text-white bg-[#303030] transition-colors hover:bg-gray-700 ${idx < travelersOptions.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full md:w-auto md:min-w-[12rem] rounded-xl bg-yellow-600 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-xl shadow-yellow-600/20 transition duration-300 hover:bg-yellow-500 hover:shadow-yellow-500/30"
            >
              <Search className="w-4 h-4" />
              Buscar Ruta
            </button>

          </form>
        </motion.div>
        
      </div>

      {/* CSS Animation keyframe injected inside the component */}
      <style>{`
        @keyframes zoomOut {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1.0);
          }
        }
      `}</style>
    </section>
  );
}
