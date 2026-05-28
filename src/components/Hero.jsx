import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Users } from 'lucide-react';

export default function Hero({ onOpenReservation }) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('2');

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
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform transition-transform duration-10000 ease-out"
          style={{ animation: 'zoomOut 20s infinite alternate' }}
        />
        {/* Subtle neutral gradients to keep the hero image balanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-900/25 to-slate-950/85" />
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
          Camina entre nubes <br />y leyendas andinas
        </motion.h1>

        {/* Subtitle Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-stone-200/90 font-light max-w-2xl leading-relaxed font-sans"
        >
          Rutas de montaña exclusivas, parajes glaciares y el encanto colonial de los pueblos de Mérida y Táchira. Una experiencia refinada y consciente.
        </motion.p>

        {/* Search Engine Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mt-12 bg-white/95 dark:bg-[#262626]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl text-andes-forest dark:text-white border border-white/20 dark:border-white/5"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Input Destino */}
            <div className="flex flex-col text-left px-2">
              <label className="text-xs font-semibold text-andes-forest/50 dark:text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-andes-gold" /> Destino
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent font-medium text-sm text-andes-forest dark:text-white border-0 focus:ring-0 p-0 focus:outline-none cursor-pointer [&>option]:text-black"
              >
                <option value="">¿A dónde viajamos?</option>
                <option value="Mérida - Teleférico Mukumbarí">Páramos y Teleférico</option>
                <option value="Pico Bolívar - Ruta Alta Montaña">Pico Bolívar (Trekking)</option>
                <option value="Ruta de los Pueblos del Sur">Pueblos del Sur</option>
                <option value="Páramo La Culata y Aguas Termales">La Culata & Termas</option>
              </select>
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-andes-forest/10 dark:bg-white/10 mx-auto" />

            {/* Input Fecha */}
            <div className="flex flex-col text-left px-2">
              <label className="text-xs font-semibold text-andes-forest/50 dark:text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-andes-gold" /> Cuándo
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent font-medium text-sm text-andes-forest dark:text-white border-0 focus:ring-0 p-0 focus:outline-none cursor-pointer dark:[color-scheme:dark]"
              />
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-andes-forest/10 dark:bg-white/10 mx-auto" />

            {/* Input Viajeros */}
            <div className="flex flex-col text-left px-2">
              <label className="text-xs font-semibold text-andes-forest/50 dark:text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-andes-gold" /> Viajeros
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full bg-transparent font-medium text-sm text-andes-forest dark:text-white border-0 focus:ring-0 p-0 focus:outline-none cursor-pointer [&>option]:text-black"
              >
                <option value="1">1 Persona</option>
                <option value="2">2 Personas</option>
                <option value="3">3 Personas</option>
                <option value="4">4+ Personas</option>
              </select>
            </div>

            {/* Botón Buscar */}
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full py-3.5 bg-andes-gold hover:bg-andes-goldHover text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                Buscar Ruta
              </button>
            </div>

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
