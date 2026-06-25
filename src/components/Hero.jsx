import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onOpenReservation }) {

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-andes-forest text-white overflow-visible md:overflow-hidden py-20 px-6 sm:px-8 lg:px-12">
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
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55)' }}
        >
          Ecoturismo & Aventura Andina
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] max-w-4xl"
          style={{ textShadow: '0 25px 45px rgba(0,0,0,0.45)' }}
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
